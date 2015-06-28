package models
import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"github.com/otiai10/twistream"
)

type User struct {
	Id                             int64  `bson:"id"`
	IdStr                          string `bson:"id_str"`
	Name                           string `bson:"name"`
	ScreenName                     string `bson:"screen_name"`
	Location                       string `bson:"location"`
	Url                            string `bson:"url"`
	Description                    string `bson:"string"`
	Protected                      bool   `bson:"protected"`
	FollowersCount                 int    `bson:"followers_count"`
	FriendsCount                   int    `bson:"friends_count"`
	ListedCount                    int    `bson:"listed_count"`
	CreatedAt                      string `bson:"created_at"`
	FavouritesCount                int    `bson:"favourites_count"`
	UtcOffset                      int    `bson:"utc_offset"`
	TimeZone                       string `bson:"time_zone"`
	GeoEnabled                     bool   `bson:"geo_enabled"`
	Verified                       bool   `bson:"verified"`
	StatusesCount                  int64  `bson:"statuses_count"`
	Lang                           string `bson:"lang"`
	ContributorsEnabled            bool   `bson:"contributors_enabled"`
	IsTranslator                   bool   `bson:"is_translator"`
	IsTranslationEnabled           bool   `bson:"is_translation_enabled"`
	ProfileBackgroundColor         string `bson:"profile_background_color"`
	ProfileBackgroundImageUrl      string `bson:"profile_background_image_url"`
	ProfileBackgroundImageUrlHttps string `bson:"profile_background_image_url_https"`
	ProfileBackgroundTile          bool   `bson:"profile_background_tile"`
	ProfileImageUrl                string `bson:"profile_image_url"`
	ProfileImageUrlHttps           string `bson:"profile_image_url_https"`
	ProfileLinkColor               string `bson:"profile_link_color"`
	ProfileSidebarBorderColor      string `bson:"profile_sidebar_border_color"`
	ProfileSidebarFillColor        string `bson:"profile_sidebar_fill_color"`
	ProfileTextColor               string `bson:"profile_text_color"`
	ProfileUseBackgroundImage      bool   `bson:"profile_use_background_image"`
	DefaultProfile                 bool   `bson:"default_profile"`
	DefaultProfileImage            bool   `bson:"default_profile_image"`
	Following                      bool   `bson:"following"`
	FollowRequestSent              bool   `bson:"follow_request_sent"`
	Notifications                  bool   `bson:"notifications"`
}

func FindUserByIdStr(db *mgo.Database, idstr string) (*User, error) {
	user := new(User)
	err := db.C("users").Find(bson.M{"id_str": idstr}).One(user)
	return user, err
}

func SaveNewUser(db *mgo.Database, user *User) error {
	return db.C("users").Insert(user)
}

func NewUserFromTwistreamStatus(tw twistream.Status) *User {
	user := new(User)
	user.ScreenName = tw.User.ScreenName
	user.Id = tw.User.Id
	user.IdStr = tw.User.IdStr
	return user
}