package handlers

import (
	"log"

	"github.com/otiai10/hisyotan/app/utils/words"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
)

type EchoHandler struct{}

func (h EchoHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	return words.Parse(tw.Text).Has("/echo")
}

func (h EchoHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {
	botname := config.V.Twitter.Bot.ScreenName
	txt := words.Parse(tw.Text).
		Remove("@" + botname).
		Remove("/echo").
		Prepend("@" + tw.User.ScreenName).
		Append("って何？").
		Join(" ")
	err := tl.Tweet(twistream.Status{
		Text:                txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
	log.Println(txt, err)
	return err
}
