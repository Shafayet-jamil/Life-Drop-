export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blood rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
