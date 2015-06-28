package handlers

import (
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/app/utils/words"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
)

type DoneHandler struct{}

func (h DoneHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	d := words.Parse(tw.Text)
	return (d.Has("/done") || d.Has("/d"))
}

func (h DoneHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {

	botname := config.V.Twitter.Bot.ScreenName

	user, err := models.FindUserByIdStr(DB(), tw.User.IdStr)
	if err != nil {
		return err
	}

	d := words.Parse(tw.Text).Remove("@" + botname).Remove("/done", "/d")

	newlist := words.New(user.TODOs...).Remove(d.Words...).Words
	user.TODOs = newlist

	user.Update(DB())

	txt := words.New(d.Words...).
		Prepend("@" + tw.User.ScreenName).
		Append("削除しました").
		Join(" ")
	return tl.Tweet(twistream.Status{
		Text:                txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
