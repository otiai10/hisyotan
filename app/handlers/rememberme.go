package handlers

import (
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"github.com/otiai10/words"
)

// RememberMeHandler ...
type RememberMeHandler struct{}

// Match ...
func (h RememberMeHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	return words.Parse(tw.Text).Has("/rememberme")
}

// Handle ...
func (h RememberMeHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {

	user, err := models.FindUserByIDStr(DB(), tw.User.IdStr)
	if err == nil {
		text := words.New("@" + user.ScreenName).
			Add("すでにしってますしおすし").Join(" ")
		return tl.Tweet(twistream.Status{
			Text:                text,
			InReplyToScreenName: tw.User.ScreenName,
			InReplyToStatusId:   tw.Id,
		})
	}

	err = models.SaveNewUser(DB(), models.NewUserFromTwistreamStatus(tw))
	if err != nil {
		return err
	}

	text := words.New("@"+tw.User.ScreenName, "おぼえましたし！").Join(" ")

	return tl.Tweet(twistream.Status{
		Text:                text,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
