package handlers

import (
	"github.com/otiai10/hisyotan/app/bot"
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

	user, err := models.FindUserByIDStr(DB(), tw.User.IdStr)
	if err != nil {
		return err
	}

	todos := words.Parse(tw.Text).
		Remove(bot.ScreenName("@")).
		Remove("@" + user.ScreenName).
		Remove(commands...)

	user.Todos = words.New(user.Todos...).Add(todos.List()...).List()
	if err := user.Update(DB()); err != nil {
		return err
	}

	text := words.New(todos.List()...).
		Prepend("@" + user.ScreenName).
		Add("追加しました！").
		Join(" ")

	return tl.Tweet(twistream.Status{
		Text:                text,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
