package handlers

import (
	"net/http"
)

/* TODO: implement a CORS middleware handler, as described
in https://drstearns.github.io/tutorials/cors/ that responds
with the following headers to all requests:

  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
  Access-Control-Expose-Headers: Authorization
  Access-Control-Max-Age: 600
*/

type ResponseHeader struct {
	handler      http.Handler
	headerNames  []string
	headerValues []string
}

func (l *ResponseHeader) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	for i := 0; i < len(headerNames); i++ {
		w.Header().Add(rh.headerNames[i], rh.headerValue[i])
	}

	l.handler.ServeHTTP(w, r)
}

func NewResponseHeader(handlerToWrap http.Handler, headerName string, headerValue string) *ResponseHeader {
	return &ResponseHeader{handlerToWrap, headerNames, headerValues}
}
