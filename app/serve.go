package app

import (
	"log"

	"github.com/otiai10/hisyotan/app/handlers"
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/app/routes"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"gopkg.in/mgo.v2"
)

// Serve ...
func Serve() {

	tl, err := twistream.New(
		"https://userstream.twitter.com/1.1/user.json",
		config.V.Twitter.Consumer.Key,
		config.V.Twitter.Consumer.Secret,
		config.V.Twitter.Bot.AccessToken,
		config.V.Twitter.Bot.AccessTokenSecret,
	)

	if err != nil {
		log.Fatalf("failed to init timeline: %v", err)
	}

	routes.LoadHandlers([]routes.MatchHandler{
		&handlers.DoneHandler{},
		&handlers.ListHandler{},
		&handlers.AddHandler{},
		&handlers.RememberMeHandler{},
		&handlers.HelloHandler{},
		&handlers.AddHandler{},
	})

	// {{{ TODO: あとでなおす. filterとかでかっちょよくする
	mongosession, err := mgo.Dial(config.MongoURI())
	if err != nil {
		log.Fatalf("failed to connect mongodb: %v", err)
	}
	models.SetRootSession(mongosession)
	// }}}

	routes.Listen(tl)
}
