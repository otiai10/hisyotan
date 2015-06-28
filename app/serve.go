package app
import (
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/hisyotan/app/routes"
	"github.com/otiai10/twistream"
	"log"
)

func Serve() {

	tl, err := twistream.New(
		"https://userstream.twitter.com/1.1/user.json",
		config.V.Twitter.Consumer.Key,
		config.V.Twitter.Consumer.Secret,
		config.V.Twitter.Bot.AccessToken,
		config.V.Twitter.Bot.AccessTokenSecret,
	)

	if err != nil {
		log.Fatalf("failed to init timeline")
	}

	routes.LoadHandlers()
	routes.Listen(tl)
}