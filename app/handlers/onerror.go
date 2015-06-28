package handlers

import (
	"github.com/otiai10/hisyotan/app/utils/words"
	"github.com/otiai10/twistream"
)

type OnErrorHandler struct{}

func (h OnErrorHandler) HandleError(err error, tw twistream.Status, tl *twistream.Timeline) error {
	// botname := config.V.Twitter.Bot.ScreenName
	txt := words.Parse("エラー、よく聞き取れませんでした: ").
		Prepend("@otiai10").
		Append(err.Error()).
		Join(" ")
	return tl.Tweet(twistream.Status{
		Text:                txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
	return err
}
