package handlers

import (
	"log"

	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/app/utils/words"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
)

type RememberMeHandler struct{}

func (h RememberMeHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	return words.Parse(tw.Text).Has("/rememberme")
}

func (h RememberMeHandler) Handle(tw twistream.Status, tl *twistream.Timeline) error {

	user, err := models.FindUserByIdStr(DB(), tw.User.IdStr)
	log.Println(user, err)

	if err == nil {
		txt := words.New("いや、もう知ってますよ...").Prepend("@" + tw.User.ScreenName).Join()
		return tl.Tweet(twistream.Status{
			Text:                txt,
			InReplyToScreenName: tw.User.ScreenName,
			InReplyToStatusId:   tw.Id,
		})
	}

	err = models.SaveNewUser(DB(), models.NewUserFromTwistreamStatus(tw))
	if err != nil {
		return err
	}

	txt := words.New("よろしくおねがいしまーす！ 今日も1日がんばるぞい！").Prepend("@" + tw.User.ScreenName).Join()
	return tl.Tweet(twistream.Status{
		Text:                txt,
		InReplyToScreenName: tw.User.ScreenName,
		InReplyToStatusId:   tw.Id,
	})
}
