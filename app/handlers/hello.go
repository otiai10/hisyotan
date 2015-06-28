package handlers

import (
	"log"
	"github.com/otiai10/twistream"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/hisyotan/app/utils/words"
	"github.com/otiai10/hisyotan/app/models"
)

type HelloHandler struct{}

func (h HelloHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	return words.Parse(tw.Text).Has("/hello")
}

func (h HelloHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {

	user, err := models.FindUserByIdStr(DB(), tw.User.IdStr)
	log.Println(user, err)

	if err == nil {
		txt := words.New("hello! hello!").Prepend("@" + tw.User.ScreenName).Join()
		return tl.Tweet(twistream.Status{
			Text: txt,
			InReplyToScreenName: tw.User.ScreenName,
			InReplyToStatusId: tw.Id,
		})
	}

	txt := words.New("誰すか？").Prepend("@" + tw.User.ScreenName).Join()
	return tl.Tweet(twistream.Status{
		Text: txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId: tw.Id,
	})
}
