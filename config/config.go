package config

import (
	"fmt"
	"os"
	"path"

	"github.com/BurntSushi/toml"
	"github.com/otiai10/curr"
	"github.com/otiai10/ternary"
)

type Conf struct {
	Twitter Twitter `toml:"twitter"`
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

var V = Conf{}

func init() {
	loadAppConf()
}

func loadAppConf() {
	env := os.Getenv("hisyotan_env")
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
