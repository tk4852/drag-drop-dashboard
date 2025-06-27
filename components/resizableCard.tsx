'use client'

import { useRef, useState } from 'react'

export default function SideResizableCard() {
  const [width, setWidth] = useState(300)
  const [leftOffset, setLeftOffset] = useState(0)
  const minWidth = 200
  const maxWidth = 800
  const containerRef = useRef<HTMLDivElement>(null)

  const startResize = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width
    const startLeft = leftOffset

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX

      if (direction === 'right') {
        const newWidth = Math.min(Math.max(startWidth + deltaX, minWidth), maxWidth)
        setWidth(newWidth)
      } else if (direction === 'left') {
        const newWidth = Math.min(Math.max(startWidth - deltaX, minWidth), maxWidth)
        const newOffset = startLeft + deltaX
        setWidth(newWidth)
        setLeftOffset(newOffset)
      }
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div ref={containerRef} className="relative h-64 mt-10 flex items-start justify-center">
      <div
        className="bg-white border shadow-md rounded-md p-4 relative"
        style={{
          width: `${width}px`,
          transform: `translateX(${leftOffset}px)`,
        }}
      >
        {/* Left Handle */}
        <div
          onMouseDown={(e) => startResize(e, 'left')}
          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize z-10"
        />

        {/* Right Handle */}
        <div
          onMouseDown={(e) => startResize(e, 'right')}
          className="absolute right-0 top-0 h-full w-2 cursor-ew-resize z-10"
        />

        <div className="text-center">Resizable Card (Left & Right Independent)</div>
      </div>
    </div>
  )
}
