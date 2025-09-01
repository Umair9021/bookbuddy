"use client"
import { useEffect, useState } from "react"
import { animate } from "framer-motion"

export default function AnimatedCounter({ value, duration = 2, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate: (latest) => setCount(Math.floor(latest)),
    })
    return () => controls.stop()
  }, [value, duration])

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  )
}
