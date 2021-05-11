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

func TestUserHandler(t *testing.T) {
	cases := []struct {
		name              string
		reqMethod         string
		reqBody           []byte
		contentTypeHeader string
		errCode           int
		ctx               *HandlerContext
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
			http.StatusCreated,
			&HandlerContext{
				sessStore: sessions.NewMemStore(time.Hour, time.Hour),
				userStore: users.NewTestUserStore(),
				key:       "banana",
			},
		},
		{
			"Bad content type",
			"POST",
			[]byte(`{"email":"pavelbat@uw.edu",
			"password":"hunter2_",
			"passwordConf":"hunter2_",
			"userName":"pavelbat",
			"firstName":"Pavel",
			"lastName":"Batalov"}`),
			"application/pavelFile",
			http.StatusOK,
			&HandlerContext{
				sessStore: sessions.NewMemStore(time.Hour, time.Hour),
				userStore: users.NewTestUserStore(),
				key:       "banana",
			},
		},
		{
			"Bad body",
			"POST",
			[]byte(`pavelformat`),
			"application/json",
			http.StatusBadRequest,
			&HandlerContext{
				sessStore: sessions.NewMemStore(time.Hour, time.Hour),
				userStore: users.NewTestUserStore(),
				key:       "banana",
			},
		},
		{
			"Bad User Inputs",
			"POST",
			[]byte(`{"email":"pavel batalov's email",
			"password":"hunter2_",
			"passwordConf":"bananan",
			"userName":"",
			"firstName":"Pavel",
			"lastName":"Batalov"}`),
			"application/json",
			http.StatusInternalServerError,
			&HandlerContext{
				sessStore: sessions.NewMemStore(time.Hour, time.Hour),
				userStore: users.NewTestUserStore(),
				key:       "banana",
			},
		},
		{
			"Unsupported method",
			"GET",
			[]byte(`{"email":"pavelbat@uw.edu",
			"password":"hunter2_",
			"passwordConf":"hunter2_",
			"userName":"pavelbat",
			"firstName":"Pavel",
			"lastName":"Batalov"}`),
			"application/json",
			http.StatusMethodNotAllowed,
			&HandlerContext{
				sessStore: sessions.NewMemStore(time.Hour, time.Hour),
				userStore: users.NewTestUserStore(),
				key:       "banana",
			},
		},
	}
	
	url := "/v1/users"

	for _, c := range cases {
		req, err := http.NewRequest(c.reqMethod, url, bytes.NewBuffer(c.reqBody))
		if err != nil {
			t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
		}
		req.Header.Set("Content-Type", c.contentTypeHeader)
		rr := httptest.NewRecorder()
		c.ctx.UsersHandler(rr, req)

		if rr.Code != c.errCode {
			t.Errorf("Error on test %v: handler returned wrong status code: got %v want %v", c.name, rr.Code, c.errCode)
		}
	}
}
