package handlers

import (
	"log"

	"github.com/otiai10/hisyotan/app/routes"
	"github.com/otiai10/twistream"
	"github.com/otiai10/words"
)

// OnErrorHandler ...
type OnErrorHandler struct {
	HandlerBase
}

// HandleError ...
func (h OnErrorHandler) HandleError(err error, tw twistream.Status, tl routes.Tweetable) error {
	// botname := config.V.Twitter.Bot.ScreenName
	log.Println(tw.Text, err.Error())
	text := words.New("@otiai10", ">_<").
		Add(words.Truncate(err.Error(), 100, "...")).Join(" ")

	return tl.Tweet(twistream.Status{
		Text:                text,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
