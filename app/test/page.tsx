export default function Test() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Test Page</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <p className="text-gray-600 mb-4">If you see proper styling here, Tailwind is working!</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Test Button
        </button>
      </div>
    </div>
  )
}