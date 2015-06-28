package words

import (
	. "github.com/otiai10/mint"
	"testing"
)
func TestAll(t *testing.T) {
	Expect(t, Parse("hoge fuga piyo").Remove("fuga").Join(",")).ToBe("hoge,piyo")
	Expect(t, Parse("foo/bar/buz", "/").Prepend("unko").Append("oppai").Join("*")).ToBe("unko*foo*bar*buz*oppai")
	Expect(t, New("hoge", "fuga").Join()).ToBe("hoge fuga")
}