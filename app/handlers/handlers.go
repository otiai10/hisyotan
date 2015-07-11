package handlers

import (
	"github.com/otiai10/hisyotan/config"
	"gopkg.in/mgo.v2"
)

// まじでよくないので、filterとかやりたい
var MongoSession *mgo.Session

func DB() *mgo.Database {
	return MongoSession.DB(config.MongoDatabaseName())
}

var commands = []string{
	"/a", "/add",
	"/l", "/list",
	"/d", "/done",
	"/echo",
	"/hello",
	"/rememberme",
}
