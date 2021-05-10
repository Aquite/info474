package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)


func TestSessionsHandler(t *testing.T) {
	cases := []struct {
		request     string
		path        string
		URL         string
		expectError bool
	}{
		{
			"Valid URL",
			"This is a valid HTML page, so this should work",
			"https://info441-wi21.github.io/tests/ogall.html",
			false,
		},
		{
			"Not Found URL",
			"Remember to check the response status code",
			"https://info441-wi21.github.io/tests/not-found.html",
			true,
		},
		{
			"Non-HTML URL",
			"Remember to check the response content-type to ensure it's an HTML page",
			"https://info441-wi21.github.io/tests/test.png",
			true,
		},
	}

	for _, c := range cases {
		req, err := http.NewRequest("POST", "/v1/sessions", nil)
		if err != nil {
			t.Fatal(err)
		}

		rr := httptest.NewRecorder()
    	handler := http.HandlerFunc(SessionsHandler)
		handler.serveHTTP(rr, req)
		// Check the status code is what we expect.
		if status := rr.Code; status != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, http.StatusOK)
		}
	
		// Check the response body is what we expect.
		expected := `{"alive": true}`
		if rr.Body.String() != expected {
			t.Errorf("handler returned unexpected body: got %v want %v",
				rr.Body.String(), expected)
		}
	}
}