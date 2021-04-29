package sessions

import (
	"errors"
	"net/http"
	"strings"
)

const headerAuthorization = "Authorization"
const paramAuthorization = "auth"
const schemeBearer = "Bearer "

//ErrNoSessionID is used when no session ID was found in the Authorization header
var ErrNoSessionID = errors.New("no session ID found in " + headerAuthorization + " header")

//ErrInvalidScheme is used when the authorization scheme is not supported
var ErrInvalidScheme = errors.New("authorization scheme not supported")

//BeginSession creates a new SessionID, saves the `sessionState` to the store, adds an
//Authorization header to the response with the SessionID, and returns the new SessionID
func BeginSession(signingKey string, store Store, sessionState interface{}, w http.ResponseWriter) (SessionID, error) {
	//TODO:
	//- create a new SessionID
	sessionID, error := NewSessionID(signingKey)
	if error != nil {
		return InvalidSessionID, error
	}
	// TODO: Handle the error
	//- save the sessionState to the store
	err := store.Save(sessionID, sessionState)
	if err != nil {
		return InvalidSessionID, err
	}
	//- add a header to the ResponseWriter that looks like this:
	//    "Authorization: Bearer <sessionID>"
	//  where "<sessionID>" is replaced with the newly-created SessionID
	//  (note the constants declared for you above, which will help you avoid typos)
	sessionIDString := schemeBearer + sessionID.String()
	w.Header().Add(headerAuthorization, sessionIDString)

	return sessionID, nil
}

//GetSessionID extracts and validates the SessionID from the request headers
func GetSessionID(r *http.Request, signingKey string) (SessionID, error) {
	//TODO: get the value of the Authorization header,
	//or the "auth" query string parameter if no Authorization header is present,
	//and validate it. If it's valid, return the SessionID. If not
	//return the validation error.
	reqToken := r.Header.Get(headerAuthorization)
	// if reqToken is empty use query string parameter
	if len(reqToken) == 0 {
		reqToken = r.URL.Query().Get("auth")
		// r.URL.query.Get("auth")
	}
	splitToken := strings.Split(reqToken, " ")
	// if its not equal to 2 throw an error
	if len(splitToken) != 2 {
		return InvalidSessionID, errors.New("incorrect scheme")
	}

	if splitToken[0] != "Bearer" {
		return InvalidSessionID, errors.New("incorrect scheme")
	}

	sessionID, err := ValidateID(splitToken[1], signingKey)
	if err != nil {
		return InvalidSessionID, err
	}
	return sessionID, nil
}

//GetState extracts the SessionID from the request,
//gets the associated state from the provided store into
//the `sessionState` parameter, and returns the SessionID
func GetState(r *http.Request, signingKey string, store Store, sessionState interface{}) (SessionID, error) {
	//TODO: get the SessionID from the request, and get the data
	//associated with that SessionID from the store.
	sessionID, err := GetSessionID(r, signingKey)
	if err != nil {
		return InvalidSessionID, err
	}
	err2 := store.Get(sessionID, sessionState)
	if err2 != nil {
		return InvalidSessionID, err2
	}
	return sessionID, nil
}

//EndSession extracts the SessionID from the request,
//and deletes the associated data in the provided store, returning
//the extracted SessionID.
func EndSession(r *http.Request, signingKey string, store Store) (SessionID, error) {
	//TODO: get the SessionID from the request, and delete the
	//data associated with it in the store.
	sessionID, err := GetSessionID(r, signingKey)
	if err != nil {
		return InvalidSessionID, err
	}
	error := store.Delete(sessionID)
	if error != nil {
		return InvalidSessionID, error
	}

	return sessionID, nil
}
