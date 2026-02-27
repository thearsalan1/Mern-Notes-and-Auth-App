export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-900">Primetrade</span>
        <div className="flex gap-2">
          <a href="/login" className="text-sm px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">
            Login
          </a>
          <a href="/register" className="text-sm px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors">
            Register
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">Backend Intern Assignment</p>
        <h1 className="text-4xl font-light text-gray-900 mb-3">Primetrade Notes</h1>
        <p className="text-sm text-gray-400 mb-8 max-w-xs">
          Auth · RBAC · Notes CRUD
        </p>
        <div className="flex gap-3">
          <a href="/register" className="text-sm px-5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors">
            Get started
          </a>
          <a href="/login" className="text-sm px-5 py-2.5 border border-gray-200 text-gray-500 rounded-md hover:border-gray-400 hover:text-gray-900 transition-colors">
            Sign in
          </a>
        </div>
      </main>

      <footer className="text-center py-5 text-xs text-gray-300 border-t border-gray-100">
        © {new Date().getFullYear()} Primetrade
      </footer>
    </div>
  );
}