package handlers

import (
	"strconv"
	"assignments-Aquite/servers/gateway/models/users"
	// "assignments-Aquite/servers/gateway/models/users/user"
	"assignments-Aquite/servers/gateway/sessions"
	"encoding/json"
	"fmt"
	"net/http"
	"path"
	"strings"
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
			http.Error(w, "unsupported media type", http.StatusUnsupportedMediaType)
			w.Write([]byte("415-Request body must be in json!"))
		}
		u := &NewUser{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(u)
		if err != nil {
			fmt.Printf("error decoding JSON: %v\n", err)
			panic(err)
		}
		valerr := u.Validate()
		if valerr != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
		}

		user, err2 := ctx.UserStore.Insert(u)
		if err2 != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
		}

		newSession := &sessionState{time.Now(), u}
		sessions.BeginSession(ctx.key, ctx.sessStore, newSession, w)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)

		encoder := json.NewEncoder(r.Body)
		encerr := encoder.Encode(u)
    if encerr != nil {
			w.Write([]byte("error encoding struct into JSON: %v\n", encerr))
			panic(encerr)
    }
	}
}

func (ctx *HandlerContext) SpecificUserHandler(w http.ResponseWriter, r *http.Request) {

	currSession := &sessionState{​​​​​​​​}​​​​​​​​
	user = currSession.User
	cred := &users.Credentials{​​​​​​​​}​​​​​​​​
	decoder.Decode(cred)
	decerr := user.Authenticate(cred.Password)
	if decerr != nil {
		http.Error("User not found". http.StatusUnauthorized)
	}

	if r.Method == http.MethodGet {
		p := strings.Split(r.URL.Path, "/")
		strid := p[3]
		id, parseerr := strconv.ParseInt(strid, 10, 32)
		user, err := ctx.User.GetByID(id)
		if err != nil {
			http.Error(w, "User not Found", http.StatusNotFound)
			w.WriteHeader(http.StatusForbidden)
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			encoder := json.NewEncoder(r.Body)
			err := encoder.Encode(user)
			if err != nil {
				w.Write([]byte("error encoding struct into JSON: %v\n", err))
				panic(err)
			}
		}
	} else if r.Method == http.MethodPatch {
		p := strings.Split(r.URL.Path, "/")
		strid := p[3]
		id, parseerr := strconv.ParseInt(strid, 10, 32)

		currSession := &sessionState()
		curruser := currSession.User
		user, iderr := ctx.userStore.GetByID(curruser.ID)
		if user != curruser {
			http.Error("User cannot be authenticated", http.StatusForbidden)
		}

		if strid != "me"{
			http.Error("User cannot be authenticated", http.StatusForbidden)
		}

		if r.Header.Get("Content-type") != "application/json" {
			http.Error("Content type is not supported", http.StatusUnsupportedMediaType)
		}
		up := users.Updates()

		dec := json.NewDecoder(r.Body)
		if err := dec.Decode(up); err != nil {
			w.Write([]byte("error encoding struct into JSON: %v\n", err))
		}
		userStruct := &User{}
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		encoder := json.NewEncoder(r.Body)
		err := encoder.Encode(userStruct)
	} else {
		http.Error("Method not supported", http.StatusMethodNotAllowed)
	}
}

// SessionsHandler handles requests for the "sessions" resource, and allows
// clients to begin a new session using an existing user's credentials.
func (c *HandlerContext) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		if r.Header.Get("Content-type") != "application/json" {
			http.Error(w, "415-Request body must be in json!", http.StatusUnsupportedMediaType)
			return
		}
		decoder := json.NewDecoder(r.Body)
		newCredentials := &users.Credentials{}
		decoder.Decode(newCredentials)
		user, err := c.UserStore.GetByEmail(newCredentials.Email)
		if err != nil {
			bcrypt.GenerateFromPassword([]byte("doesnt matter"), 13)

			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		err = user.Authenticate(newCredentials.Password)
		if err != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		newSession := &SessionState{time.Now(), user}
		sessions.BeginSession(c.Key, c.SessionStore, newSession, w)
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
func (c *HandlerContext) SpecificSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "DELETE" {
		if path.Base(r.URL.String()) != "mine" {
			http.Error(w, "resource path invalid", http.StatusForbidden)
			return
		}
		_, err := sessions.EndSession(r, c.Key, c.SessionStore)
		if err != nil {
			http.Error(w, "resource path invalid", http.StatusNotFound)
			return
		}
		w.Write([]byte("signed out"))
	} else {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		return
	}
}