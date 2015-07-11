package models

import (
	"github.com/otiai10/twistream"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type User struct {
	ID                        int64  `bson:"id"`
	IDStr                     string `bson:"id_str"`
	Name                      string `bson:"name"`
	ScreenName                string `bson:"screen_name"`
	Location                  string `bson:"location"`
	URL                       string `bson:"url"`
	Description               string `bson:"string"`
	Protected                 bool   `bson:"protected"`
	FollowersCount            int    `bson:"followers_count"`
	FriendsCount              int    `bson:"friends_count"`
	ListedCount               int    `bson:"listed_count"`
	CreatedAt                 string `bson:"created_at"`
	FavouritesCount           int    `bson:"favourites_count"`
	UtcOffset                 int    `bson:"utc_offset"`
	TimeZone                  string `bson:"time_zone"`
	GeoEnabled                bool   `bson:"geo_enabled"`
	Verified                  bool   `bson:"verified"`
	StatusesCount             int64  `bson:"statuses_count"`
	Lang                      string `bson:"lang"`
	ContributorsEnabled       bool   `bson:"contributors_enabled"`
	IsTranslator              bool   `bson:"is_translator"`
	IsTranslationEnabled      bool   `bson:"is_translation_enabled"`
	ProfileBackgroundColor    string `bson:"profile_background_color"`
	ProfileBackgroundImageURL string `bson:"profile_background_image_url"`
	// ProfileBackgroundImageURLHttps string `bson:"profile_background_image_url_https"`
	ProfileBackgroundTile bool   `bson:"profile_background_tile"`
	ProfileImageURL       string `bson:"profile_image_url"`
	// ProfileImageURLlHttps          string `bson:"profile_image_url_https"`
	ProfileLinkColor          string `bson:"profile_link_color"`
	ProfileSidebarBorderColor string `bson:"profile_sidebar_border_color"`
	ProfileSidebarFillColor   string `bson:"profile_sidebar_fill_color"`
	ProfileTextColor          string `bson:"profile_text_color"`
	ProfileUseBackgroundImage bool   `bson:"profile_use_background_image"`
	DefaultProfile            bool   `bson:"default_profile"`
	DefaultProfileImage       bool   `bson:"default_profile_image"`
	Following                 bool   `bson:"following"`
	FollowRequestSent         bool   `bson:"follow_request_sent"`
	Notifications             bool   `bson:"notifications"`

	Todos []string `bson:"todos"`
}

// FindUserByIDStr ...
func FindUserByIDStr(db *mgo.Database, idstr string) (*User, error) {
	user := new(User)
	err := db.C("users").Find(bson.M{"id_str": idstr}).One(user)
	return user, err
}

// SaveNewUser ...
func SaveNewUser(db *mgo.Database, user *User) error {
	return db.C("users").Insert(user)
}

// Update ...
func (user *User) Update(db *mgo.Database) error {
	_, err := db.C("users").Upsert(bson.M{
		"id_str": user.IDStr,
	}, user)
	return err
}

// NewUserFromTwistreamStatus ...
func NewUserFromTwistreamStatus(tw twistream.Status) *User {
	user := new(User)
	user.ScreenName = tw.User.ScreenName
	user.ID = tw.User.Id
	user.IDStr = tw.User.IdStr
	return user
}
