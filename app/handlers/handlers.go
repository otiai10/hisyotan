package handlers
import (
	"gopkg.in/mgo.v2"
	"github.com/otiai10/hisyotan/config"
)

// まじでよくないので、filterとかやりたい
var MongoSession *mgo.Session

func DB() *mgo.Database {
	return MongoSession.DB(config.MongoDatabaseName())
}