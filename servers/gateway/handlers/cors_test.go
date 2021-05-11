package handlers

import (
	"assignments-Aquite/servers/gateway/sessions"
	"assignments-Aquite/servers/gateway/users"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestServeHTTP(t *testing.T) {
	cases := []struct {
		name         string
		headerNames  []string
		headerValues []string
		testHandler  *HandlerContext
	}{
		{
			"Valid Test",
			[]string{"Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers", "Access-Control-Expose-Headers", "Access-Control-Max-Age"},
			[]string{"*", "GET, PUT, POST, PATCH, DELETE", "Content-Type, Authorization", "Authorization", "600"},
			&HandlerContext{
				sessStore: sessions.NewMemStore(time.Hour, time.Hour),
				userStore: users.NewFakeUserStore(),
				key:       "banana",
			},
		},
	}

	for _, c := range cases {
		req, err := http.NewRequest("POST", "/v1/users", bytes.NewBuffer([]byte(
			`{"email":"pavelbat@uw.edu",
			"password":"hunter2_",
			"passwordConf":"hunter2_",
			"userName":"pavelbat",
			"firstName":"Pavel",
			"lastName":"Batalov"}`)))
		if err != nil {
			t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
		}
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		c.testHandler.UsersHandler(rr, req)
		testMux := http.NewServeMux()
		testMux.HandleFunc("/v1/users", c.testHandler.UsersHandler)
		testCors := NewResponseHeader(testMux, c.headerNames, c.headerValues)
		testCors.ServeHTTP(rr, req)
		headerACAO := rr.Header().Get("Access-Control-Allow-Origin")
		if headerACAO != "*" {
			t.Errorf("Access-Control-Allow-Origin should be %s, but is %v", "*", headerACAO)
		}
		headerACAM := rr.Header().Get("Access-Control-Allow-Methods")
		if headerACAM != "GET, PUT, POST, PATCH, DELETE" {
			t.Errorf("Access-Control-Allow-Methods should be %s, but is %v", "GET, PUT, POST, PATCH, DELETE", headerACAM)
		}
		headerACAH := rr.Header().Get("Access-Control-Allow-Headers")
		if headerACAH != "Content-Type, Authorization" {
			t.Errorf("Access-Control-Allow-Methods should be %s, but is %v", "GET, PUT, POST, PATCH, DELETE", headerACAM)
		}
		headerACEH := rr.Header().Get("Access-Control-Expose-Headers")
		if headerACEH != "Authorization" {
			t.Errorf("Access-Control-Expose-Headers should be %s, but is %v", "Authorization", headerACEH)
		}
		headerACMA := rr.Header().Get("Access-Control-Max-Age")
		if headerACMA != "600" {
			t.Errorf("Access-Control--Max-Age should be %s, but is %v", "600", headerACMA)
		}
	}
}
