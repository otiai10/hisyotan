package routes

import (
	"testing"

	. "github.com/otiai10/mint"
)

func TestLoadHandlers(t *testing.T) {
	Expect(t, true).ToBe(true)
	LoadHandlers()
}
