package handlers

import (
	"log"
	"github.com/otiai10/twistream"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/hisyotan/app/utils/words"
	"github.com/otiai10/hisyotan/app/models"
)

type AddHandler struct{}

func (h AddHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	d := words.Parse(tw.Text)
	return (d.Has("/add") || d.Has("/a"))
}

func (h AddHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {

	user, err := models.FindUserByIdStr(DB(), tw.User.IdStr)
	if err != nil {
		return err
	}

	words.New(user.TODOs...)

	botname := config.V.Twitter.Bot.ScreenName
	txt := words.New(user.TODOs...).
		Remove("@" + botname).Remove("/add", "/a").
		Prepend("@" + tw.User.ScreenName).
		Append("いちらんです").
		Join(" ")
	return tl.Tweet(twistream.Status{
		Text: txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId: tw.Id,
	})
}
