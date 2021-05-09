package handlers

import (
	"assignments-Aquite/servers/gateway/models/users"
	"assignments-Aquite/servers/gateway/models/users/user"
	"encoding/json"
	"net/http"
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
