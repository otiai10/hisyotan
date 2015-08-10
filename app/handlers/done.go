package handlers

import (
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/app/routes"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"github.com/otiai10/words"
)

// DoneHandler ...
type DoneHandler struct {
	HandlerBase
}

// Match ...
func (h DoneHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	d := words.Parse(tw.Text)
	return (d.Has("/done") || d.Has("/d"))
}

// Handle ...
func (h DoneHandler) Handle(tw twistream.Status, tl routes.Tweetable) error {

	botname := config.V.Twitter.Bot.ScreenName

	user, err := models.FindUserByIDStr(h.DB, tw.User.IdStr)
	if err != nil {
		return err
	}

	user.Todos = words.New(user.Todos...).
		Remove(words.Parse(tw.Text).List()...).
		List()

	if err := user.Update(h.DB); err != nil {
		return err
	}

	text := words.Parse(tw.Text).Remove("@"+botname, "/done", "/d").
		Prepend("@" + user.ScreenName).
		Append("おつかれさま！").Join(" ")

	return tl.Tweet(twistream.Status{
		Text:                text,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
