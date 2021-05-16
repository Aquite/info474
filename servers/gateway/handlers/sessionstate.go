package handlers

import (
	"assignments-Aquite/servers/gateway/models/users"
	"time"
)

//TODO: define a session state struct for this web server
//see the assignment description for the fields you should include
//remember that other packages can only see exported fields!
type sessionState struct {
	Time time.Time `json:"time"`
	User *users.User `json:"user"`
}