export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-6xl">📭</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="mb-6 text-gray-600">{message}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
