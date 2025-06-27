"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"

function Sidebar({ layout }: { layout: "left" | "top" }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "sidebar",
  })

  const isVertical = layout === "left"

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {}

  return (
    <aside
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`absolute z-30 bg-white shadow-md rounded-xl ${isVertical
          ? "top-16 left-0 w-64 p-4 flex flex-col"
          : "top-16 left-0 right-0 h-24 px-6 py-3 flex items-center gap-6"
        }`}
    >
      <button
        className={`bg-red-500 text-white font-semibold rounded-md ${isVertical ? "w-full py-2 mb-4" : "px-4 py-2"
          }`}
      >
        + Create
      </button>
      <nav
        className={`text-sm font-medium ${isVertical ? "flex flex-col space-y-2" : "flex flex-row gap-4"
          }`}
      >
        {["🏠 Start", "📁 Directory", "📄 Docs", "✅ Tasks"].map((item) => (
          <button
            key={item}
            className={`hover:bg-gray-100 rounded-md ${isVertical ? "p-2 w-full" : "px-3 py-1"
              }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function DroppableZone({ id, className }: { id: string; className: string }) {
  const { isOver, setNodeRef } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`absolute z-10 border-2 border-dashed transition-all ${isOver ? "border-blue-400 bg-blue-50" : "border-transparent"
        } ${className}`}
    />
  )
}

export default function DashboardPage() {
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "top">("left")
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  // Initialize GridStack after render
  useEffect(() => {
    const grid = GridStack.init({
      float: true,
      cellHeight: 80,
      resizable: {
        handles: "all",
      },
    })

    return () => {
      grid?.destroy()
    }
  }, [])


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id === "sidebar" && over) {
      if (over.id === "left-slot") {
        setSidebarPosition("left")
      }
      if (over.id === "top-slot") {
        setSidebarPosition("top")
      }
    }
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => setActiveId(event.active.id.toString())}
    >
      <div className="h-screen bg-[#f5eee9] text-gray-800 overflow-hidden">
        {/* Topbar */}
        <header className="fixed top-0 left-0 right-0 h-16 px-6 flex items-center justify-between border-b bg-white shadow-sm z-40">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-md">
            Subscribe Now
          </button>
        </header>

        {/* Drop Zones for Sidebar */}
        <DroppableZone
          id="left-slot"
          className="top-16 left-0 w-64 h-[calc(100%-4rem)]"
        />
        <DroppableZone
          id="top-slot"
          className="top-16 left-0 right-0 h-24"
        />

        {/* Sidebar */}
        {activeId !== "sidebar" && <Sidebar layout={sidebarPosition} />}

        {/* GridStack Widgets */}
        <div
          className={`overflow-auto px-4 transition-all duration-300 ${sidebarPosition === "top" ? "pt-[10rem]" : "pt-16"
            } h-[calc(100%-1rem)]`}
        >
          <div className="grid-stack">
            {/* Main Content */}
            <div
              className="grid-stack-item"
              gs-x="2"
              gs-y={sidebarPosition === "top" ? "1" : "0"}
              gs-w="6"
              gs-h="6"
            >
              <div className="grid-stack-item-content bg-white rounded-xl shadow-md p-4 flex items-center justify-center">
                Main Content Area
              </div>
            </div>

            {/* Right Top Widget */}
            <div
              className="grid-stack-item"
              gs-x="8"
              gs-y={sidebarPosition === "top" ? "1" : "0"}
              gs-w="4"
              gs-h="3"
            >
              <div className="grid-stack-item-content bg-white rounded-xl shadow-md p-4">
                Roles & Permissions
              </div>
            </div>

            {/* Right Bottom Widget */}
            <div
              className="grid-stack-item"
              gs-x="8"
              gs-y={sidebarPosition === "top" ? "4" : "3"}
              gs-w="4"
              gs-h="3"
            >
              <div className="grid-stack-item-content bg-white rounded-xl shadow-md p-4">
                Document Management
              </div>
            </div>
          </div>
        </div>

        {/* Drag Overlay for Sidebar */}
        <DragOverlay>
          {activeId === "sidebar" && <Sidebar layout={sidebarPosition} />}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
