package words
import "strings"

var delimiter = " "

type Dict struct {
	Raw string
	Words []string
	orig  []string
}

func Parse(raw string, delim ...string) *Dict {
	delim = append(delim, delimiter)
	return New(strings.Split(raw, delim[0])...)
}

func New(ss ...string) *Dict {
	d := new(Dict)
	for _, s := range ss {
		d.Words = append(d.Words, s)
	}
	d.orig = d.Words
	return d
}

func (d *Dict) Has(s string) bool {
	for _, w := range d.Words {
		if w == s {
			return true
		}
	}
	return false
}

func (d *Dict) Remove(ss ...string) *Dict {
	copy := []string{}
	for _, w := range d.Words {
		for _, s := range ss {
			if w != s {
				copy = append(copy, w)
			}
		}
	}
	d.Words = copy
	return d
}

func (d *Dict) Join(delim ...string) string {
	delim = append(delim, delimiter)
	return strings.Join(d.Words, delim[0])
}

func (d *Dict) Prepend(ss ...string) *Dict {
	d.Words = append(ss, d.Words...)
	return d
}

func (d *Dict) Append(ss ...string) *Dict {
	d.Words = append(d.Words, ss...)
	return d
}