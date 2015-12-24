package message

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"time"

	"github.com/otiai10/curr"
)

// Provider ...
type Provider map[string][]string

var provider = Provider{}

func (p Provider) random(key string) string {
	rand.Seed(time.Now().Unix())
	return p[key][rand.Intn(len(p[key]))]
}

func init() {
	f, err := os.Open(filepath.Join(curr.Dir(), "messages", "message.ja.json"))
	if err != nil {
		panic(err)
	}
	if err := json.NewDecoder(f).Decode(&provider); err != nil {
		panic(err)
	}
}

// Get ...
func Get(key string, params ...interface{}) string {
	return get(key, params...)
}

func get(key string, params ...interface{}) string {
	return fmt.Sprintf(provider.random(key), params...)
}
