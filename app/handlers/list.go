package handlers

import (
	"github.com/otiai10/hisyotan/app/bot"
	"github.com/otiai10/hisyotan/app/message"
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"github.com/otiai10/words"
)

// ListHandler ...
type ListHandler struct{}

// Match ...
func (h ListHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	d := words.Parse(tw.Text)
	return (d.Has("/list") || d.Has("/l"))
}

// Handle ...
func (h ListHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {

	user, err := models.FindUserByIDStr(DB(), tw.User.IdStr)
	if err != nil {
		return err
	}

	if len(user.Todos) == 0 {
		txt := words.New("@"+user.ScreenName).
			Append(message.Get("list.empty"), bot.TS()).Join(" ")
		return tl.Tweet(twistream.Status{
			Text:                txt,
			InReplyToScreenName: tw.User.ScreenName,
			InReplyToStatusId:   tw.Id,
		})
	}

	botname := config.V.Twitter.Bot.ScreenName
	txt := words.New(user.Todos...).
		Remove("@"+botname).Remove("/add", "/a").
		Prepend("@" + tw.User.ScreenName).
		Append("いちらんです").
		Join(" ")
	return tl.Tweet(twistream.Status{
		Text:                txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
