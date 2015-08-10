package handlers

import "gopkg.in/mgo.v2"

type HandlerBase struct {
	DB *mgo.Database
}

func (h *HandlerBase) SetDB(db *mgo.Database) {
	h.DB = db
}

var commands = []string{
	"/a", "/add",
	"/l", "/list",
	"/d", "/done",
	"/echo",
	"/hello",
	"/rememberme",
}
