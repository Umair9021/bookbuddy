'use client'
import React, { useEffect, useRef, useState } from 'react'

export default function BackgroundCarousel({
  images = [
    '/bg-carousel/bg1.jpeg',
    '/bg-carousel/bg2.jpeg',
    '/bg-carousel/bg3.jpeg',
  ],
  interval = 5000,
  transition = 800,
  onColorChange = null,
}) {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [isSliding, setIsSliding] = useState(false)
  const timerRef = useRef(null)
  const postTransitionTimerRef = useRef(null)
  const moveToRef = useRef(0)
  const mountedRef = useRef(false)
  const trackRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timerRef.current) clearInterval(timerRef.current)
      if (postTransitionTimerRef.current) clearTimeout(postTransitionTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!images || images.length <= 1) return
    // start interval
    timerRef.current = setInterval(() => {
      goNext()
    }, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (postTransitionTimerRef.current) clearTimeout(postTransitionTimerRef.current)
    }
  }, [images, interval])

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const start = () => {
    if (!images || images.length <= 1) return
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      goNext()
    }, interval)
  }

  // prepare slides with clones for seamless looping
  const slides = (images && images.length > 1) ? [images[images.length - 1], ...images, images[0]] : images

  // initialize index to 1 (first real slide) when using clones
  useEffect(() => {
    if (slides.length > 1) setIndex(1)
  }, [])

  const goNext = () => {
    if (!slides || slides.length <= 1) return
    setIsSliding(true)
    setIndex((prev) => {
      const next = prev + 1
      moveToRef.current = next
      return next
    })

    if (postTransitionTimerRef.current) clearTimeout(postTransitionTimerRef.current)
    postTransitionTimerRef.current = setTimeout(() => {
      setIsSliding(false)
      // If moved to cloned last slide, snap back to first real slide without animation
      if (moveToRef.current === slides.length - 1) {
        setAnimate(false)
        setIndex(1)
        // re-enable animation on next tick
        setTimeout(() => setAnimate(true), 50)
      }
    }, transition + 30)
  }

  // compute dominant color of a given image src and call onColorChange
  const extractDominantColor = (src) => {
    if (!src || typeof window === 'undefined' || typeof onColorChange !== 'function') return
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const w = Math.min(120, img.width)
          const h = Math.min(80, img.height)
          canvas.width = w
          canvas.height = h
          const sx = Math.max(0, (img.width - w) / 2)
          const sy = Math.max(0, (img.height - h) / 2)
          ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h)
          const data = ctx.getImageData(0, 0, w, h).data
          let r = 0, g = 0, b = 0, count = 0
          for (let i = 0; i < data.length; i += 16) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            count++
          }
          r = Math.round(r / count)
          g = Math.round(g / count)
          b = Math.round(b / count)
          const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
          onColorChange(hex)
        } catch (e) {
          // ignore errors (tainted canvas etc.)
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // when index changes and animation finishes, extract dominant color of the visible real slide
  useEffect(() => {
    if (!slides || slides.length <= 1) return
    // visible real slide index in slides array
    const visible = index
    // if visible is a clone (0 or slides.length-1) then real index would be 1 or slides.length-2
    const realIndex = visible === 0 ? 1 : (visible === slides.length - 1 ? slides.length - 2 : visible)
    const src = slides[realIndex]
    // wait for transition to finish before extracting to avoid partial renders
    const t = setTimeout(() => extractDominantColor(src), transition + 50)
    return () => clearTimeout(t)
  }, [index])

  // sliding track approach with clones for seamless looping
  return (
    /*#__PURE__*/React.createElement('div', {
      'aria-hidden': true,
      className: 'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
      onMouseEnter: stop,
      onMouseLeave: start,
    },
      /*#__PURE__*/React.createElement('div', {
        className: 'h-full w-full overflow-hidden',
        style: { position: 'relative' }
      },
        /*#__PURE__*/React.createElement('div', {
          ref: trackRef,
          className: 'h-full flex',
          style: {
            width: `${slides.length * 100}%`,
            transform: `translateX(-${(index * 100) / Math.max(slides.length, 1)}%)`,
            transition: animate ? `transform ${transition}ms ease-in-out` : 'none',
            willChange: 'transform'
          }
        }, slides.map((src, i) => /*#__PURE__*/React.createElement('div', {
          key: src + '-' + i,
          className: 'h-full flex-shrink-0',
          style: {
            width: `${100 / Math.max(slides.length, 1)}%`,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        })))
      ),
      /*#__PURE__*/React.createElement('div', { className: 'absolute inset-0 bg-black/20' })
    )
  )
}
