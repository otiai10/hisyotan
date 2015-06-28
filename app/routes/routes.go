package routes

import (
	"github.com/otiai10/hisyotan/app/handlers"
	"github.com/otiai10/twistream"
)

type MatchHandler interface {
	Matcher
	Handler
}

type Matcher interface {
	Match(twistream.Status) bool
}

type Handler interface {
	Handle(twistream.Status, *twistream.Timeline) error
}

var (
	routes  []MatchHandler
	onerror chan error // TODO: これもあとでやろう
)

func LoadHandlers() error {
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
	routes = []MatchHandler{
		handlers.EchoHandler{},
	}
	return nil
}

func Listen(timeline *twistream.Timeline) {
	ch := timeline.Listen()
	for {
		select {
		case tw := <-ch:
			matchesAndHandles(tw, timeline)
		}
	}
}

func matchesAndHandles(tw twistream.Status, tl *twistream.Timeline) error {
	for _, h := range routes {
		if h.Match(tw) {
			err := h.Handle(tw, tl)
			return err
		}
	}
	return nil
}
