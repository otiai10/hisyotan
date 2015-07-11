package bot

import (
	"time"

	"github.com/otiai10/hisyotan/config"
)

// ScreenName ...
func ScreenName(prefix ...string) string {
	prefix = append(prefix, "")
	return prefix[0] + config.V.Twitter.Bot.ScreenName
}

// TS ...
func TS() string {
	return time.Now().Format("15:04")
}
