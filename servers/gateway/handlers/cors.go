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

func (rh *ResponseHeader) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	for i := 0; i < len(rh.headerNames); i++ {
		w.Header().Add(rh.headerNames[i], rh.headerValues[i])
	}

	rh.handler.ServeHTTP(w, r)
}

func NewResponseHeader(handlerToWrap http.Handler, headerNames []string, headerValues []string) *ResponseHeader {
	return &ResponseHeader{handlerToWrap, headerNames, headerValues}
}
