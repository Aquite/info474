package handlers

import (
	"assignments-Aquite/servers/gateway/models/users"
	"assignments-Aquite/servers/gateway/sessions"
	"encoding/json"
	"fmt"
	"net/http"
	"path"
	"strconv"
	"time"

	"golang.org/x/crypto/bcrypt"
)

//TODO: define HTTP handler functions as described in the
//assignment description. Remember to use your handler context
//struct as the receiver on these functions so that you have
//access to things like the session store and user store.

func (ctx *HandlerContext) UsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		if r.Header.Get("Content-type") != "application/json" {
			http.Error(w, "request body must be in JSON", http.StatusUnsupportedMediaType)
			return
		}
		nu := &users.NewUser{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(nu)
		if err != nil {
			http.Error(w, "error decoding response body", http.StatusBadRequest)
			return
		}
		u, err := nu.ToUser()
		if err != nil {
			http.Error(w, fmt.Sprintf("error creating user: %v:", err), http.StatusInternalServerError)
			return
		}

		u, err = ctx.userStore.Insert(u)
		if err != nil {
			http.Error(w, fmt.Sprintf("error inserting user: %v:", err), http.StatusInternalServerError)
			return
		}

		newSession := &sessionState{time.Now(), u}
		_, err = sessions.BeginSession(ctx.key, ctx.sessStore, newSession, w)
		if err != nil {
			http.Error(w, fmt.Sprintf("error creating session: %v:", err), http.StatusInternalServerError)
			return
		}

		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)

		encoder := json.NewEncoder(w)
		err = encoder.Encode(u)
    	if err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
    	}
	} else {
		http.Error(w, "Method not supported", http.StatusMethodNotAllowed)
		return
	}
}

func (ctx *HandlerContext) SpecificUserHandler(w http.ResponseWriter, r *http.Request) {

	currSessionId, err := sessions.GetSessionID(r, ctx.key)
	if err != nil {
		http.Error(w, "You are not authorized to access this content", http.StatusUnauthorized)
		return
	}

	strId := path.Base(r.URL.Path)
	intId := int64(0)

	if r.Method == http.MethodGet {
		

		if strId == "me" {
			currSession := &sessionState{}
			err = ctx.sessStore.Get(currSessionId, currSession)
			if err != nil {
				http.Error(w, "Error getting current session", http.StatusInternalServerError)
				return
			}
			intId = currSession.User.ID
		} else {
			id, err := strconv.Atoi(strId)
			if err != nil {
				http.Error(w, "Error retrieving inputted ID", http.StatusInternalServerError)
				return
			}
			intId = int64(id)
		}


		user, err := ctx.userStore.GetByID(intId)
		if err != nil {
			http.Error(w, "User not Found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		encoder := json.NewEncoder(w)
		err = encoder.Encode(user)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}

	} else if r.Method == http.MethodPatch {

		currSession := &sessionState{}
		err = ctx.sessStore.Get(currSessionId, currSession)
		if err != nil {
			http.Error(w, "Error retrieving session state", http.StatusInternalServerError)
			return
		}

		if strId != "me" {
			id, err := strconv.Atoi(strId)
			if err != nil {
				http.Error(w, "Error retrieving inputted ID", http.StatusInternalServerError)
				return
			}
			if int64(id) != currSession.User.ID {
				http.Error(w, "You are not authorized to edit this content", http.StatusForbidden)
				return
			}
		}

		if r.Header.Get("Content-type") != "application/json" {
			http.Error(w, "Content type is not supported", http.StatusUnsupportedMediaType)
		}

		up := &users.Updates{}

		
		dec := json.NewDecoder(r.Body)
		err = dec.Decode(up);
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding JSON: %v\n", err), http.StatusBadRequest)
		}
		if err := currSession.User.ApplyUpdates(up); err != nil {
			http.Error(w, fmt.Sprintf("Error when applying updates: %v", err), http.StatusInternalServerError)
			return
		}
		if err := ctx.sessStore.Save(currSessionId, currSession); err != nil {
			http.Error(w, fmt.Sprintf("Error when applying updates: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		encoder := json.NewEncoder(w)
		err = encoder.Encode(currSession.User)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "Method not supported", http.StatusMethodNotAllowed)
	}
}

// SessionsHandler handles requests for the "sessions" resource, and allows
// clients to begin a new session using an existing user's credentials.
func (ctx *HandlerContext) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		if r.Header.Get("Content-type") != "application/json" {
			http.Error(w, "Request body must be in json!", http.StatusUnsupportedMediaType)
			return
		}
		decoder := json.NewDecoder(r.Body)
		newCredentials := &users.Credentials{}
		err := decoder.Decode(newCredentials)
		if err != nil {
			http.Error(w, "error decoding response body", http.StatusBadRequest)
			return
		}
		user, err := ctx.userStore.GetByEmail(newCredentials.Email)
		if err != nil {
			bcrypt.GenerateFromPassword([]byte("wasting time"), 13)

			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		err = user.Authenticate(newCredentials.Password)
		if err != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		newSession := &sessionState{time.Now(), user}
		_, err = sessions.BeginSession(ctx.key, ctx.sessStore, newSession, w)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error creating session: %v:", err), http.StatusInternalServerError)
			return
		}
		/*
		userIP := r.Header.Get("X-Forwarded-For")
		if len(userIP) != 0 {
			ipList := strings.Split(userIP, ", ")
			userIP = ipList[0]
		} else {
			userIP = r.RemoteAddr
		}
		err = ctx.UserStore.InsertSignIn(thisUser, time.Now(), userIP)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error logging sign-in: %v:", err), http.StatusInternalServerError)
		}
		*/

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		enc := json.NewEncoder(w)
		enc.Encode(user)
	} else {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		return
	}
}

// SpecificSessionHandler requests related to a specific authenticated session
func (ctx *HandlerContext) SpecificSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "DELETE" {
		if path.Base(r.URL.String()) != "mine" {
			http.Error(w, "You're not allowed to do that", http.StatusForbidden)
			return
		}
		sessions.EndSession(r, ctx.key, ctx.sessStore)
		w.Write([]byte("signed out"))
	} else {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		return
	}
}
