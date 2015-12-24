package app

import (
	"log"
	"os"
	"testing"

	"github.com/otiai10/hisyotan/app/handlers"
	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/app/routes"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"

	"gopkg.in/mgo.v2"
)

var db *mgo.Database

type DummyTimeline struct {
	ch     chan twistream.Status
	tweets []twistream.Status
}

func (tl *DummyTimeline) Listen() <-chan twistream.Status {
	return tl.ch
}
func (tl *DummyTimeline) Tweet(tw twistream.Status) error {
	tl.tweets = append([]twistream.Status{tw}, tl.tweets...)
	return nil
}

func TestMain(m *testing.M) {
	setup()
	code := m.Run()
	os.Exit(code)
}

func setup() {

	config.Init("test")

	sess, err := mgo.Dial("mongodb://localhost:27017/hisyotan-test")
	if err != nil {
		panic(err)
	}

	db = sess.DB("hisyotan-test")

	db.DropDatabase()
}

func Test_Story(t *testing.T) {

	routes.LoadHandlers([]routes.MatchHandler{
		&handlers.DoneHandler{},
		&handlers.ListHandler{},
		&handlers.AddHandler{},
		&handlers.RememberMeHandler{},
		&handlers.HelloHandler{},
		&handlers.AddHandler{},
	})

	// {{{ TODO: あとでなおす. filterとかでかっちょよくする
	mongosession, err := mgo.Dial(config.MongoURI())
	if err != nil {
		log.Fatalf("failed to connect mongodb: %v", err)
	}
	models.SetRootSession(mongosession)
	// }}}

	tl := &DummyTimeline{
		ch: make(chan twistream.Status),
	}

	go func() {
		routes.Listen(tl)
	}()

	tl.ch <- twistream.Status{
		User: twistream.User{
			IdStr:      "12345",
			ScreenName: "otiai10",
		},
		InReplyToUserIdStr: config.V.Twitter.Bot.UserID,
		Text:               "/hello",
	}

	log.Println(tl.tweets)
}
