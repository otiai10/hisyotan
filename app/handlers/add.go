package handlers

import (
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/app/utils/words"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
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

	botname := config.V.Twitter.Bot.ScreenName

	user, err := models.FindUserByIdStr(DB(), tw.User.IdStr)
	if err != nil {
		return err
	}

	d := words.Parse(tw.Text).Remove("@" + botname).Remove("/add", "/a")

	user.TODOs = append(user.TODOs, d.Words...)

	user.Update(DB())

	txt := words.New(d.Words...).
		Prepend("@" + tw.User.ScreenName).
		Append("追加しました").
		Join(" ")
	return tl.Tweet(twistream.Status{
		Text:                txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
