package handlers

import (
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
		encoder := json.NewEncoder(os.Stdout)
		err := encoder.Encode(u)
    if err != nil {
			fmt.Printf("error encoding struct into JSON: %v\n", err)
			panic(err)
    }
	}
}
