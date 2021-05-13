package handlers

import (
	"assignments-Aquite/servers/gateway/models/users"
	"assignments-Aquite/servers/gateway/sessions"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestCorsHandler(t *testing.T) {
	cases := []struct {
		name              string
		method            string
		reqBody           []byte
		contentTypeHeader string
		errCode           int
		testHandler       *HandlerContext
	}{
		{
			"Valid Input",
			"POST",
			[]byte(`{"email":"pavelbat@uw.edu",
			"password":"hunter2_",
			"passwordConf":"hunter2_",
			"userName":"pavelbat",
			"firstName":"Pavel",
			"lastName":"Batalov"}`),
			"application/json",
			http.StatusOK,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "matador",
			},
		},
		{
			"Valid Input",
			"OPTIONS",
			[]byte(`{"email":"pavelbat@uw.edu",
			"password":"hunter2_",
			"passwordConf":"hunter2_",
			"userName":"pavelbat",
			"firstName":"Pavel",
			"lastName":"Batalov"}`),
			"application/json",
			http.StatusOK,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "matador",
			},
		},
	}

	for _, c := range cases {
		req, err := http.NewRequest(c.method, "/v1/users", bytes.NewBuffer(c.reqBody))
		if err != nil {
			t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
		}
		req.Header.Set("Content-Type", c.contentTypeHeader)
		rr := httptest.NewRecorder()
		c.testHandler.UsersHandler(rr, req)
		testMux := http.NewServeMux()
		testMux.HandleFunc("/v1/users", c.testHandler.UsersHandler)
		testCors := &CorsMW{
			MyHandler: testMux,
		}
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
			t.Errorf("Access-Control-Allow-Headers should be %s, but is %v", "Content-Type, Authorization", headerACAH)
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