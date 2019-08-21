package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

const (
	target = "https://chromedevsummit-site.firebaseapp.com/"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	targetURL, err := url.Parse(target)
	if err != nil {
		panic(err)
	}
	reverseProxy := &httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.URL.Scheme = targetURL.Scheme
			req.URL.Host = targetURL.Host
			req.Host = targetURL.Host
			req.Header.Set("Host", targetURL.Host)
		},
	}

	err = http.ListenAndServe(fmt.Sprintf(":%s", port), reverseProxy)
	if err != nil {
		log.Fatalf("Could not start reverse proxy: %s", err)
	}
}
