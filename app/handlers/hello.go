package handlers

import (
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/app/routes"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"github.com/otiai10/words"
)

// HelloHandler ...
type HelloHandler struct {
	HandlerBase
}

// Match ...
func (h HelloHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	return words.Parse(tw.Text).Has("/hello")
}

// Handle ...
func (h HelloHandler) Handle(tw twistream.Status, tl routes.Tweetable) error {

	_, err := models.FindUserByIDStr(h.DB, tw.User.IdStr)

	if err == nil {
		txt := words.New("hello! hello!").Prepend("@" + tw.User.ScreenName).Join(" ")
		return tl.Tweet(twistream.Status{
			Text:                txt,
			InReplyToScreenName: tw.User.ScreenName,
			InReplyToStatusId:   tw.Id,
		})
	}

	txt := words.New("誰すか？").Prepend("@" + tw.User.ScreenName).Join(" ")
	return tl.Tweet(twistream.Status{
		Text:                txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
