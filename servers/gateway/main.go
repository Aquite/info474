package main

import (
	"assignments-Aquite/servers/gateway/handlers"
	"assignments-Aquite/servers/gateway/sessions"
	"assignments-Aquite/servers/gateway/users"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-redis/redis"
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

	ctx := handlers.NewHandlerContext(sessionKey, sessions.NewRedisStore(redisdb, time.Hour), users.NewSQLStore(userStore))

	mux := http.NewServeMux()


	mux.HandleFunc("/v1/summary", handlers.SummaryHandler)
	mux.HandleFunc("/v1/users", ctx.UsersHandler)
	mux.HandleFunc("/v1/users/", ctx.SpecificUserHandler)
	mux.HandleFunc("/v1/sessions", ctx.SessionsHandler)
	mux.HandleFunc("/v1/sessions/", ctx.SpecificSessionHandler)

	wrappedMux := handlers.NewResponseHeader(
		mux,
		[]string{"Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers", "Access-Control-Expose-Headers", "Access-Control-Max-Age"},
		[]string{"*", "GET, PUT, POST, PATCH, DELETE", "Content-Type, Authorization", "Authorization", "600"})

	log.Printf("server is listening at %s", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, wrappedMux))

}
