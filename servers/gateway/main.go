package main

import (
	Handlers "assignments-Aquite/servers/gateway/handlers"
	"fmt"
	"log"
	"net/http"
	"os"
)

//main is the main entry point for the server
func main() {
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":443"
	}

	tlsCertPath := os.Getenv("TLSCERT")
	if len(tlsCertPath) == 0 {
		log.Fatal(fmt.Errorf("err is: %s", "Bad Cert"))
	}

	tlsKeyPath := os.Getenv("TLSKEY")
	if len(tlsKeyPath) == 0 {
		log.Fatal(fmt.Errorf("err is: %s", "Bad Key"))
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/v1/summary", Handlers.SummaryHandler)

	log.Printf("server is listening at %s", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, mux))

}
