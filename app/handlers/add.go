package handlers

import (
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"github.com/otiai10/words"
)

// AddHandler TODOをaddするんだ
type AddHandler struct{}

// Match ...
func (h AddHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	d := words.Parse(tw.Text)
	return (d.Has("/add") || d.Has("/a"))
}

// Handle ...
func (h AddHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {

	botname := config.V.Twitter.Bot.ScreenName

	user, err := models.FindUserByIDStr(DB(), tw.User.IdStr)
	if err != nil {
		return err
	}

	text := words.Parse(tw.Text).Remove("@"+botname).Remove("/add", "/a").
		Prepend("@" + user.ScreenName).Join(" ")

	return tl.Tweet(twistream.Status{
		Text:                text,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
