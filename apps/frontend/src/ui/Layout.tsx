import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const nav = useNavigate()
  return (
    <div>
      <header className="bg-white border-b">
        <div className="container py-4 flex gap-4 items-center">
          <Link to="/" className="font-bold text-xl">Rivy Storefront</Link>
          <input placeholder="Search products..." className="input flex-1" onKeyDown={(e) => {
            if (e.key === 'Enter') nav('/?q=' + encodeURIComponent((e.target as HTMLInputElement).value))
          }} />
          <Link to="/cart" className="btn">Cart</Link>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
      <footer className="container py-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Rivy
      </footer>
    </div>
  )
}
