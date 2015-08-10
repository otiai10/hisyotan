package handlers

import (
	"github.com/otiai10/hisyotan/app/routes"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"github.com/otiai10/words"
)

// EchoHandler ...
type EchoHandler struct {
	HandlerBase
}

// Match ...
func (h EchoHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	return words.Parse(tw.Text).Has("/echo")
}

// Handle ...
func (h EchoHandler) Handle(tw twistream.Status, tl routes.Tweetable) error {
	botname := config.V.Twitter.Bot.ScreenName

	text := words.Parse(tw.Text).
		Remove("@" + botname).Remove("/echo").
		Prepend("@" + tw.User.ScreenName).Join(" ")

	return tl.Tweet(twistream.Status{
		Text:                text,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
