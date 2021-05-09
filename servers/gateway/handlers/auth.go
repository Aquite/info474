package handlers

import (
	"assignments-Aquite/servers/gateway/models/users"
	"assignments-Aquite/servers/gateway/models/users/user"
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
			w.WriteHeader(http.StatusUnsupportedMediaType)
			w.Write([]byte("415-Request body must be in json!"))
		}
		u := user.&NewUser
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(u)
		if err != nil {
			fmt.Printf("error decoding JSON: %v\n", err)
			panic(err)
		}
		BeginSession(&ctx.key, &ctx.sessStore, 100, w)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)

		encoder := json.NewEncoder(r.Body)
		err := encoder.Encode(u)
    if err != nil {
			w.Write([]byte("error encoding struct into JSON: %v\n", err))
			panic(err)
    }
	}
}

func (ctx *HandlerContext) SpecificUserHandler(w http.ResponseWriter, r *http.Request) {

	user := sessionstate.sessionState

	if r.Method == http.MethodGet {
		p := strings.Split(r.URL.Path, "/")
		id := p[3]
		user, err := ctx.userStore.GetByID(id)
		if err != nil {
			fmt.Printf("no such user exists: %v\n", err)
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
	}

	if r.Method == http.MethodPatch {
		p := strings.Split(r.URL.Path, "/")
		id := p[3]
		if id != "me" { // or does not match authenticated user
			fmt.Printf("forbidden status: %v\n", err)
			w.WriteHeader(http.StatusForbidden)
		}
		if r.Header.Get("Content-type") != "application/json" {
			w.WriteHeader(http.StatusUnsupportedMediaType)
			w.Write([]byte("415-Request body must be in json!"))
		}
		up := user.Updates

		dec := json.NewDecoder(r.Body)
		if err := dec.Decode(up); err != nil {
			w.Write([]byte("error encoding struct into JSON: %v\n", err))
		}
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		encoder := json.NewEncoder(r.Body)
		err := encoder.Encode(up)
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