package main

import (
	"assignments-Aquite/servers/gateway/handlers"
	"fmt"
	"log"
	"net/http"
	"os"
	"database/sql"
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

	sessionKey := os.Getenv("SESSIONKEY")
	redisAddr := os.Getenv("REDISADDR")
	datasource := os.Getenv("DSN")
	redisdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
		Password: "", 
		DB:       0,
	})

	userStore, err := sql.Open("mysql", datasource)
	if err != nil {
        log.Fatal(fmt.Errorf("err is: %s", "Error opening database"))
	}
	defer userStore.Close()

	ctx := handlers.NewHandlerContext(sessionKey, redisdb, userStore)

	mux := http.NewServeMux()

	
	mux.HandleFunc("/v1/summary", Handlers.SummaryHandler)
	mux.HandleFunc("/v1/users", Handlers.UsersHandler)
	mux.HandleFunc("/v1/users/", SpecificUserHandler)
	mux.HandleFunc("/v1/sessions", SessionsHandler)
	mux.HandleFunc("/v1/sessions/", SpecificSessionHandler)

	wrappedMux := Handlers.NewResponseHeader(mux, {"Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"
	, "Access-Control-Expose-Headers", "Access-Control-Max-Age"}, {"*", "GET, PUT, POST, PATCH, DELETE", "Content-Type, Authorization"
	, "Authorization", "600"})

	log.Printf("server is listening at %s", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, wrappedMux))

}
