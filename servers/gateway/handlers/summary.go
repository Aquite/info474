package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"golang.org/x/net/html"
)

//PreviewImage represents a preview image for a page
type PreviewImage struct {
	URL       string `json:"url,omitempty"`
	SecureURL string `json:"secureURL,omitempty"`
	Type      string `json:"type,omitempty"`
	Width     int    `json:"width,omitempty"`
	Height    int    `json:"height,omitempty"`
	Alt       string `json:"alt,omitempty"`
}

//PageSummary represents summary properties for a web page
type PageSummary struct {
	Type        string          `json:"type,omitempty"`
	URL         string          `json:"url,omitempty"`
	Title       string          `json:"title,omitempty"`
	SiteName    string          `json:"siteName,omitempty"`
	Description string          `json:"description,omitempty"`
	Author      string          `json:"author,omitempty"`
	Keywords    []string        `json:"keywords,omitempty"`
	Icon        *PreviewImage   `json:"icon,omitempty"`
	Images      []*PreviewImage `json:"images,omitempty"`
}

const headerCORS = "Access-Control-Allow-Origin"
const corsAnyOrigin = "*"

//SummaryHandler handles requests for the page summary API.
//This API expects one query string parameter named `url`,
//which should contain a URL to a web page. It responds with
//a JSON-encoded PageSummary struct containing the page summary
//meta-data.
func SummaryHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add(headerCORS, corsAnyOrigin)

	url := r.URL.Query().Get("url")
	if len(url) == 0 {
		http.Error(w, "Bad status request", http.StatusBadRequest)
		return
	}

	io, err := fetchHTML(url)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	summ, err := extractSummary(url, io)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	io.Close()

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(summ)

}

//fetchHTML fetches `pageURL` and returns the body stream or an error.
//Errors are returned if the response status code is an error (>=400),
//or if the content type indicates the URL is not an HTML page.
func fetchHTML(pageURL string) (io.ReadCloser, error) {
	resp, err := http.Get(pageURL)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("err is: %s", "bad status code")
	}

	ctype := resp.Header.Get("Content-Type")
	if !strings.HasPrefix(ctype, "text/html") {
		return nil, fmt.Errorf("err is: %s", "bad content type")
	}

	return resp.Body, nil
}

//extractSummary tokenizes the `htmlStream` and populates a PageSummary
//struct with the page's summary meta-data.
func extractSummary(pageURL string, htmlStream io.ReadCloser) (*PageSummary, error) {
	tokenizer := html.NewTokenizer(htmlStream)

	summy := PageSummary{}

	imgs := []*PreviewImage{}
	imgs = append(imgs, &PreviewImage{})
	counter := 0

	for {
		tokenType := tokenizer.Next()

		if tokenType == html.ErrorToken {
			if tokenizer.Err() == io.EOF {
				break
			}
		}

		if tokenType == html.SelfClosingTagToken || tokenType == html.StartTagToken {
			token := tokenizer.Token()
			if token.Attr != nil {
				if token.Data == "meta" {
					val, err := getAttr(token.Attr, "property")
					if err == nil {
						if val == "og:type" {
							summy.Type, _ = getAttr(token.Attr, "content")
						} else if val == "og:url" {
							summy.URL, _ = getAttr(token.Attr, "content")
						} else if val == "og:title" {
							summy.Title, _ = getAttr(token.Attr, "content")
						} else if val == "og:site_name" {
							summy.SiteName, _ = getAttr(token.Attr, "content")
						} else if val == "og:description" {
							summy.Description, _ = getAttr(token.Attr, "content")
						} else if val == "og:image" {
							if imgs[counter].URL != "" {
								imgs = append(imgs, &PreviewImage{})
								counter++
							}
							base, _ := url.Parse(pageURL)
							content, _ := getAttr(token.Attr, "content")
							u, _ := url.Parse(content)
							imgs[counter].URL = base.ResolveReference(u).String()
						} else if val == "og:image:secure_url" {
							base, _ := url.Parse(pageURL)
							content, _ := getAttr(token.Attr, "content")
							u, _ := url.Parse(content)
							imgs[counter].SecureURL = base.ResolveReference(u).String()
						} else if val == "og:image:type" {
							imgs[counter].Type, _ = getAttr(token.Attr, "content")
						} else if val == "og:image:width" {
							width, _ := getAttr(token.Attr, "content")
							imgs[counter].Width, _ = strconv.Atoi(width)
						} else if val == "og:image:height" {
							height, _ := getAttr(token.Attr, "content")
							imgs[counter].Height, _ = strconv.Atoi(height)
						} else if val == "og:image:alt" {
							imgs[counter].Alt, _ = getAttr(token.Attr, "content")
						}
					}

					val, err = getAttr(token.Attr, "name")
					if err == nil {
						if val == "author" {
							summy.Author, _ = getAttr(token.Attr, "content")
						} else if val == "keywords" {
							content, _ := getAttr(token.Attr, "content")
							slc := strings.Split(content, ",")
							for i := range slc {
								slc[i] = strings.TrimSpace(slc[i])
							}
							summy.Keywords = slc
						} else if val == "description" {
							if summy.Description == "" {
								summy.Description, _ = getAttr(token.Attr, "content")
							}
						}
					}

				} else if token.Data == "link" {
					val, err := getAttr(token.Attr, "rel")
					if err == nil && val == "icon" {
						icon := PreviewImage{}
						icon.Type, _ = getAttr(token.Attr, "type")
						base, _ := url.Parse(pageURL)
						lin, _ := getAttr(token.Attr, "href")
						u, _ := url.Parse(lin)
						icon.URL = base.ResolveReference(u).String()
						size, _ := getAttr(token.Attr, "sizes")
						if size != "any" && strings.Contains(size, "x") {
							dim := strings.Split(size, "x")
							icon.Width, _ = strconv.Atoi(dim[1])
							icon.Height, _ = strconv.Atoi(dim[0])
						}
						summy.Icon = &icon
					}
				}
			} else if token.Data == "title" {
				tokenType = tokenizer.Next()
				if tokenType == html.TextToken && summy.Title == "" {
					summy.Title = tokenizer.Token().Data
				}
			}
		} else if tokenType == html.EndTagToken {
			token := tokenizer.Token()
			if token.Data == "head" {
				break
			}
		}
	}
	if imgs[0].URL != "" {
		summy.Images = imgs
	}
	return &summy, nil
}

func getAttr(attrs []html.Attribute, target string) (string, error) {
	for i := 0; i < len(attrs); i++ {
		if attrs[i].Key == target {
			return attrs[i].Val, nil
		}
	}
	return "", fmt.Errorf("err is: %s", "n/a")
}
