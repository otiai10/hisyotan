package models

import (
	"os"
	"testing"

	"gopkg.in/mgo.v2"
)

var db *mgo.Database

func TestMain(m *testing.M) {
	setup()
	code := m.Run()
	os.Exit(code)
}

func setup() {
	sess, err := mgo.Dial("mongodb://localhost:27017/hisyotan-test")
	if err != nil {
		panic(err)
	}

	db = sess.DB("hisyotan-test")

	db.DropDatabase()
}
