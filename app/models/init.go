package models

import "gopkg.in/mgo.v2"

var rootSession *mgo.Session

// SetRootSession ...
func SetRootSession(sess *mgo.Session) {
	rootSession = sess
}

// Session ...
func Session() *mgo.Session {
	return rootSession.Copy()
}
