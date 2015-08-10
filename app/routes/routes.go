package routes

import (
	"log"

	"github.com/otiai10/hisyotan/app/models"
	"github.com/otiai10/hisyotan/config"
	"github.com/otiai10/twistream"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// MatchHandler ...
type MatchHandler interface {
	Matcher
	Handler
	DBSetter
}

// Matcher ...
type Matcher interface {
	Match(twistream.Status) bool
}

// Handler ...
type Handler interface {
	Handle(twistream.Status, Tweetable) error
}

// DBSetter ...
type DBSetter interface {
	SetDB(*mgo.Database)
}

var (
	handlers *[]MatchHandler
	onerror  chan error // TODO: これもあとでやろう
)

// LoadHandlers ...
func LoadHandlers(hs []MatchHandler) error {
	/* TODO: あとでやろう
	hp := filepath.Join(filepath.Dir(curr.Dir()), "handlers")
	pkgs, err := parser.ParseDir(token.NewFileSet(), hp, func(f os.FileInfo) bool {
		return true
	}, 0)
	if err != nil {
		panic(err)
	}
	for name, file := range pkgs["handlers"].Files {
		fmt.Println(name, file)
	}
	*/
	handlers = &hs
	return nil
}

// Timeline ...
type Timeline interface {
	Listen() <-chan twistream.Status
	Tweetable
}

// Tweetable ...
type Tweetable interface {
	Tweet(twistream.Status) error
}

// Listen ...
func Listen(timeline Timeline) {
	ch := timeline.Listen()
	for {
		select {
		case tw := <-ch:
			err := matchesAndHandles(tw, timeline)
			if err != nil {
				// TODO: 要検討
				/*
					h := handlers.OnErrorHandler{}
					h.HandleError(err, tw, timeline)
				*/
			}
		}
	}
}

func matchesAndHandles(tw twistream.Status, tl Timeline) error {
	for _, h := range *handlers {
		if h.Match(tw) {
			sess := models.Session()
			defer sess.Close()
			log.Println("ここか？？", config.V.MongoDB.Database)
			users := []models.User{}
			e := sess.DB("hisyotan-test").C("users").Find(bson.M{}).All(&users)
			log.Println("うわーん", e)
			h.SetDB(sess.DB(config.V.MongoDB.Database))
			err := h.Handle(tw, tl)
			log.Println("002", err)
			return err
		}
	}
	return nil
}
