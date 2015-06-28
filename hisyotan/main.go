package main

import (
	"io"
	"os"
	"github.com/otiai10/hisyotan/app"
)

func main() {
	Run(os.Stdout)
}

func Run(output io.Writer) {
	app.Serve()
}
