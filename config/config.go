package config

import (
	"fmt"
	"path"

	"github.com/BurntSushi/toml"
	"github.com/otiai10/curr"
	"github.com/otiai10/ternary"
)

type Conf struct {
	Twitter Twitter `toml:"twitter"`
	MongoDB mongodb `toml:"mongodb"`
}

type Twitter struct {
	Bot      bot      `toml:"bot"`
	Consumer consumer `toml:"consumer"`
}

type consumer struct {
	Key    string `toml:"key"`
	Secret string `toml:"secret"`
}
type bot struct {
	ScreenName        string `toml:"screen_name"`
	UserID            string `toml:"user_id"`
	AccessToken       string `toml:"access_token"`
	AccessTokenSecret string `toml:"access_token_secret"`
}
type mongodb struct {
	Address  string `toml:"address"`
	Database string `toml:"database"`
}

// V ...
var V = Conf{}

// Init ...
func Init(env string) {
	confpath := path.Join(
		curr.Dir(),
		fmt.Sprintf(
			"app-%s.toml",
			ternary.If(env != "").String(env, "dev"),
		),
	)
	_, err := toml.DecodeFile(confpath, &V)
	if err != nil {
		panic(err)
	}
}

// ほんとはV全部隠そうね。
func MongoURI() string {
	return V.MongoDB.Address + "/" + V.MongoDB.Database
}

func MongoDatabaseName() string {
	return V.MongoDB.Database
}
