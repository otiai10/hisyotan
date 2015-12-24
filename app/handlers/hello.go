package handlers

import (
	"log"

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
func (h *HelloHandler) Match(tw twistream.Status) bool {
	if tw.InReplyToUserIdStr != config.V.Twitter.Bot.UserID {
		return false
	}
	log.Println("ここは？")
	return words.Parse(tw.Text).Has("/hello")
}

// Handle ...
func (h *HelloHandler) Handle(tw twistream.Status, tl routes.Tweetable) error {

	log.Println("003", h.DB, tw.User.IdStr)
	/*
		user := new(models.User)
		err := h.DB.C("users").Find(bson.M{"id_str": tw.User.IdStr}).One(user)
	*/
	_, err := models.FindUserByIDStr(h.DB, tw.User.IdStr)
	log.Println("003", err)

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
