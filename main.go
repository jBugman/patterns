package main

import (
	"image"
	"image/color"
	"math"
	"math/rand"
	"fmt"
	// "os/exec"
	"sync"

	"github.com/disintegration/imaging"
)

var (
	transparentWhite = color.NRGBA{255, 255, 255, 0}
	white = color.NRGBA{255, 255, 255, 255}
	black = color.NRGBA{0, 0, 0, 255}
)

func randomImage(w, h int) image.Image {
	img := imaging.New(w, h, white)
	for x := 0; x < w; x++ {
		for y := 0; y < h; y++ {
			if rand.Float64() <= 0.3 {
				img.Set(x, y, black)
			}
		}
	}
	return img
}

func zoomedAt(src image.Image, scale, targetX, targetY float64) image.Image {
	bounds := src.Bounds()
	zoomed := imaging.Resize(src, int(float64(bounds.Dx()) * scale), 0, imaging.Lanczos)
	newBounds := zoomed.Bounds()
	dx, dy := newBounds.Dx() - bounds.Dx(), newBounds.Dy() - bounds.Dy()
	shift := image.Point{int(float64(dx) * targetX), int(float64(dy) * targetY)}
	focusedBounds := bounds.Add(shift)
	zoomed = imaging.Crop(zoomed, focusedBounds)
	return zoomed
}

func shift(src image.Image, bounds image.Rectangle, targetX, targetY float64) image.Image {
	newBounds := src.Bounds()
	dx, dy := newBounds.Dx() - bounds.Dx(), newBounds.Dy() - bounds.Dy()
	shift := image.Point{int(float64(dx) * targetX), int(float64(dy) * targetY)}
	focusedBounds := bounds.Add(shift)
	shifted := imaging.Crop(src, focusedBounds)
	return shifted
}

func transparent(src image.Image) image.Image {
	w := src.Bounds().Dx()
	h := src.Bounds().Dy()
	img := imaging.New(w, h, transparentWhite)
	for x := 0; x < w; x++ {
		for y := 0; y < h; y++ {
			p := src.At(x, y)
			r, _, _, _ := p.RGBA()
			if r == 0 {
				img.Set(x, y, p)
			}
		}
	}
	return img
}

func main() {
	const w, h = 640, 480
	const scale = 1.05
	const targetX, targetY = 0.4, 0.6

	original := randomImage(w, h)
//	overlay := zoomedAt(original, factor, targetX, targetY)
//	merged := imaging.Overlay(original, overlay, image.ZP, 1.0)
	zoomed := transparent(imaging.Resize(original, w * scale, 0, imaging.Lanczos))

	// imaging.Save(original, "original.png")
	// imaging.Save(zoomed, "overlay.png")
//	imaging.Save(merged, "merged.png")

	frames := 360
	// minX := 0.3
	// maxX := 0.8
	// dX := maxX - minX

	var wg sync.WaitGroup
	for i := 0; i < frames; i++ {
		wg.Add(1)
		go func (i int) {
//			tX := minX + 0.005 * float64(i)
			// tX := minX + dX * float64(i) / float64(frames)
			t := float64(i) / float64(180) * math.Pi
			tX := 0.5 * (1 + 0.3 * math.Cos(t))
			tY := 0.5 * (1 + 0.3 * math.Sin(t))
//			shifted := zoomedAt(original, scale, tX, tY)
			shifted := shift(zoomed, original.Bounds(), tX, tY)

			frame := imaging.Overlay(original, shifted, image.ZP, 1.0)
			imaging.Save(frame, fmt.Sprintf("frames/frame_%03d.png", i))
			println(i)
			wg.Done()
		}(i)
	}
	wg.Wait()
//	exec.Command("ffmpeg", "-pattern_type", "glob", "-i", "'frames/*.png'", "-r", "30", "-y", "out.mp4")
	// convert -delay 1x8 `seq -f frames/frame_%03g.png 0 1 29` -coalesce animation.gif
	// exec.Command("ffmpeg", "-pattern_type", "glob", "-i", "'frames/*.png'", "-r", "30", "-y", "out.gif")
}
