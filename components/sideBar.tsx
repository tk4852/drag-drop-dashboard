import { useDraggable } from "@dnd-kit/core"

function Sidebar({ layout = "vertical" }: { layout?: "vertical" | "horizontal" }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "sidebar",
  })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: "grab",
  }

  return (
    <aside
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`bg-white shadow-md rounded-xl flex-shrink-0 ${
        layout === "vertical" ? "w-64 p-4" : "w-full p-2 flex flex-row items-center gap-4"
      }`}
    >
      <div className={`${layout === "vertical" ? "mb-6 w-full" : ""}`}>
        <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md">
          + Create
        </button>
      </div>

      <nav
        className={`${
          layout === "vertical" ? "space-y-2 text-sm font-medium" : "flex flex-row gap-4 text-sm font-medium"
        }`}
      >
        {[
          ["🏠", "Start"],
          ["📁", "User Directory"],
          ["📄", "Documents"],
          ["✅", "Tasks"],
          ["⚙️", "Administration"],
          ["⚙️", "Settings"],
        ].map(([icon, label], idx) => (
          <button
            key={label}
            className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md ${
              layout === "vertical" ? "w-full" : ""
            } ${label === "Start" ? "bg-blue-100" : ""}`}
          >
            {icon} {layout === "vertical" ? label : ""}
          </button>
        ))}
      </nav>
    </aside>
  )
}
