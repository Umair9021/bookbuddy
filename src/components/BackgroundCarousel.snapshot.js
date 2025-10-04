'use client'
import React, { useEffect, useRef, useState } from 'react'

export default function BackgroundCarouselSnapshot({
  images = [
    '/bg-carousel/bg1.jpeg',
    '/bg-carousel/bg2.jpeg',
    '/bg-carousel/bg3.jpeg',
  ],
  interval = 5000,
  transition = 800,
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

  const slides = (images && images.length > 1) ? [images[images.length - 1], ...images, images[0]] : images

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
      if (moveToRef.current === slides.length - 1) {
        setAnimate(false)
        setIndex(1)
        setTimeout(() => setAnimate(true), 50)
      }
    }, transition + 30)
  }

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
            filter: isSliding ? 'brightness(1.12)' : 'brightness(1)'
          }
        })))
      ),
      /*#__PURE__*/React.createElement('div', { className: 'absolute inset-0 bg-black/20' })
    )
  )
}
