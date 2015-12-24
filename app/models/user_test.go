package models

import (
	"testing"

	. "github.com/otiai10/mint"
)

func TestUser(t *testing.T) {
	user := new(User)
	err := db.C("users").Insert(user)
	Expect(t, err).ToBe(nil)
}

func TestFindUserByIDStr(t *testing.T) {
	user := &User{
		IDStr:      "abcdefg",
		ScreenName: "otiai10",
	}
	err := db.C("users").Insert(user)
	Expect(t, err).ToBe(nil)

	found, err := FindUserByIDStr(db, "abcdefg")
	Expect(t, err).ToBe(nil)
	Expect(t, found.ScreenName).ToBe(user.ScreenName)
}

func TestUser_Update(t *testing.T) {
	user := &User{
		IDStr:      "0123456",
		ScreenName: "otiai11",
	}
	err := db.C("users").Insert(user)
	Expect(t, err).ToBe(nil)

	found, err := FindUserByIDStr(db, "0123456")
	Expect(t, err).ToBe(nil)
	Expect(t, found.ScreenName).ToBe(user.ScreenName)
	Expect(t, found.Todos).ToBe([]string{})

	user.Todos = []string{"foo", "bar", "baz"}
	err = user.Update(db)
	Expect(t, err).ToBe(nil)

	found, err = FindUserByIDStr(db, "0123456")
	Expect(t, err).ToBe(nil)
	Expect(t, found.ScreenName).ToBe(user.ScreenName)
	Expect(t, found.Todos).ToBe([]string{"foo", "bar", "baz"})
}
