import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f7] px-4">
      <div className="card max-w-md p-8 text-center">
        <p className="text-sm font-semibold text-blue-700">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-navy-950">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">That page does not exist. Return to the home page or sign in again.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-primary">
            Home
          </Link>
          <Link to="/login" className="btn-secondary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
