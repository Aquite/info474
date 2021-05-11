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
		contentType       string
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
			http.StatusUnsupportedMediaType,
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
		req.Header.Set("Content-Type", c.contentType)
		rr := httptest.NewRecorder()
		c.ctx.UsersHandler(rr, req)

		if rr.Code != c.errCode {
			t.Errorf("Error on test %v: handler returned wrong status code: got %v want %v", c.name, rr.Code, c.errCode)
		}
	}
}

func TestSpecificUserHandler(t *testing.T) {
	cases := []struct {
		name        string
		method      string
		idQuery     string
		errCode     int
		ctx         *HandlerContext
		key         string
		contentType string
		updateJSON  []byte
	}{
		{
			"Valid Get - me",
			"GET",
			"me",
			http.StatusOK,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"",
			nil,
		},
		{
			"Valid Get - number",
			"GET",
			"1",
			http.StatusOK,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"",
			nil,
		},
		{
			"Bad query",
			"GET",
			"ACAB",
			http.StatusInternalServerError,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"",
			nil,
		},
		{
			"Unauthorized",
			"GET",
			"1",
			http.StatusUnauthorized,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "no banana",
			},
			"banana",
			"",
			nil,
		},
		{
			"User not found",
			"GET",
			"2",
			http.StatusNotFound,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"",
			nil,
		},
		{
			"Valid Patch",
			"PATCH",
			"me",
			http.StatusOK,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/json",
			[]byte(`{"firstName":"John",
			"lastName":"Travolta"}`),
		},
		{
			"Valid Patch - number",
			"PATCH",
			"1",
			http.StatusOK,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/json",
			[]byte(`{"firstName":"John",
			"lastName":"Travolta"}`),
		},
		{
			"Bad Query",
			"PATCH",
			"potato",
			http.StatusInternalServerError,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/json",
			[]byte(`{"firstName":"John",
			"lastName":"Travolta"}`),
		},
		{
			"Different User / Not Found",
			"PATCH",
			"2",
			http.StatusForbidden,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/json",
			[]byte(`{"firstName":"John",
			"lastName":"Travolta"}`),
		},
		{
			"Bad Content Type",
			"PATCH",
			"me",
			http.StatusUnsupportedMediaType,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/paveltype",
			[]byte(`{"firstName":"John",
			"lastName":"Travolta"}`),
		},
		{
			"Bad JSON",
			"PATCH",
			"me",
			http.StatusBadRequest,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/json",
			[]byte(`pavelJSON`),
		},
		{
			"Wrong JSON",
			"PATCH",
			"me",
			http.StatusBadRequest,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/json",
			[]byte(`{"name":"John",
			"surname":"Travolta"}`),
		},
		{
			"Method Unsupported",
			"DELETE",
			"me",
			http.StatusMethodNotAllowed,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "banana",
			},
			"banana",
			"application/json",
			[]byte(`{"firstName":"John",
			"lastName":"Travolta"}`),
		},
	}
	url := "/v1/users/"

	for _, c := range cases {
		if c.method == "GET" {
			req, err := http.NewRequest(c.method, url+c.idQuery, nil)
			if err != nil {
				t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
			}
			rr := httptest.NewRecorder()
			stateUser, err := c.ctx.userStore.GetByID(1)
			if err != nil {
				t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
			}
			thisState := &sessionState{
				Time:  time.Now(),
				User: stateUser,
			}
			signKey, err := sessions.BeginSession(c.key, c.ctx.sessStore, thisState, rr)
			if err != nil {
				t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
			}
			req.Header.Add("Authorization", "Bearer "+signKey.String())
			c.ctx.SpecificUserHandler(rr, req)
			if status := rr.Code; status != c.errCode {
				t.Errorf("Error on test %v: handler returned wrong status code: got %v want %v", c.name, status, c.errCode)
			}
		} else {
			req, err := http.NewRequest(c.method, url+c.idQuery, bytes.NewBuffer(c.updateJSON))
			if err != nil {
				t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
			}
			req.Header.Set("Content-Type", c.contentType)
			rr := httptest.NewRecorder()
			stateUser, err := c.ctx.userStore.GetByID(1)
			if err != nil {
				t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
			}
			thisState := &sessionState{
				User: stateUser,
				Time:  time.Now(),
			}
			signKey, err := sessions.BeginSession(c.key, c.ctx.sessStore, thisState, rr)
			if err != nil {
				t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
			}
			req.Header.Add("Authorization", "Bearer "+signKey.String())
			c.ctx.SpecificUserHandler(rr, req)
			if status := rr.Code; status != c.errCode {
				t.Errorf("Error on test %v: handler returned wrong status code: got %v want %v", c.name, status, c.errCode)
			}
		}
	}
}

func TestSessionsHandler(t *testing.T) {
	cases := []struct {
		name              string
		method            string
		inputCredJSON     []byte
		contentType       string
		errCode           int
		ctx               *HandlerContext
	}{
		{
			"Valid Input",
			"POST",
			[]byte(`{"email":"pavelbat@uw.edu", 
			"password": "hunter2_"}`),
			"application/json",
			http.StatusCreated,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "caterpillars",
			},
		},
		{
			"Bad header",
			"POST",
			[]byte(`{"email":"pavelbat@uw.edu", 
			"password": "hunter2_"}`),
			"application/pavelformat",
			http.StatusUnsupportedMediaType,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "caterpillars",
			},
		},
		{
			"Bad JSON",
			"POST",
			[]byte(`{"email":"pavelbat@uw.edu", 
			"pw": "hunter2_"}`),
			"application/json",
			http.StatusBadRequest,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "caterpillars",
			},
		},
		{
			"Email not found",
			"POST",
			[]byte(`{"email":"hunter2@uw.edu", 
			"password": "hunter2_"}`),
			"application/json",
			http.StatusUnauthorized,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "caterpillars",
			},
		},
		{
			"Bad password",
			"POST",
			[]byte(`{"email":"pavelbat@uw.edu", 
			"password": "********"}`),
			"application/json",
			http.StatusUnauthorized,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "caterpillars",
			},
		},
		{
			"Bad Method",
			"GET",
			[]byte(`{"email":"pavelbat@uw.edu", 
			"password": "hunter2_"}`),
			"application/json",
			http.StatusMethodNotAllowed,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "caterpillars",
			},
		},
	}
	url := "/v1/sessions"

	for _, c := range cases {
		req, err := http.NewRequest(c.method, url, bytes.NewBuffer(c.inputCredJSON))
		if err != nil {
			t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
		}
		req.Header.Set("Content-Type", c.contentType)
		rr := httptest.NewRecorder()
		c.ctx.SessionsHandler(rr, req)

		if status := rr.Code; status != c.errCode {
			t.Errorf("Error on test %v: handler returned wrong status code: got %v want %v", c.name, status, c.errCode)
		}
	}
}

func TestSpecificSessionsHandler(t *testing.T) {
	cases := []struct {
		name        string
		method      string
		query       string
		key         string
		errCode     int
		ctx         *HandlerContext
	}{
		{
			"Valid Input",
			"DELETE",
			"mine",
			"cepillarse",
			http.StatusOK,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "cepillarse",
			},
		},
		{
			"Invalid Input",
			"DELETE",
			"yours ;)",
			"cepillarse",
			http.StatusForbidden,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "cepillarse",
			},
		},
		{
			"Bad Method",
			"GET",
			"mine",
			"cepillarse",
			http.StatusMethodNotAllowed,
			&HandlerContext{
				sessStore:     sessions.NewMemStore(time.Hour, time.Hour),
				userStore:     users.NewTestUserStore(),
				key:           "cepillarse",
			},
		},
	}
	url := "/v1/sessions/"

	for _, c := range cases {
		req, err := http.NewRequest(c.method, url+c.query, nil)
		if err != nil {
			t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
		}
		rr := httptest.NewRecorder()
		stateUser, err := c.ctx.userStore.GetByID(1)
		if err != nil {
			t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
		}
		thisState := &sessionState{
			User:  stateUser,
			Time:  time.Now(),
		}
		signKey, err := sessions.BeginSession(c.key, c.ctx.sessStore, thisState, rr)
		if err != nil {
			t.Errorf("Unexpected error occurred [%s]: %v", c.name, err)
		}
		req.Header.Add("Authorization", "Bearer "+signKey.String())
		c.ctx.SpecificSessionHandler(rr, req)
		if status := rr.Code; status != c.errCode {
			t.Errorf("Error on test %v: handler returned wrong status code: got %v want %v", c.name, status, c.errCode)
		}
	}
}