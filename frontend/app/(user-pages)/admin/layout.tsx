import Link from "next/link"

const adminNavLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Problems", href: "/admin/problemset" },
  // { label: "Notebooks", href: "/admin/notebooks" },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow page-gutter-x h-full">
      <header>Admin</header>
      <nav className="">
        {adminNavLinks.map(({ label, href }) => (
          <Link key={label + href} href={href} className="nav-link">
            {label}
          </Link>
        ))}
      </nav>
      <div>
        {children}
      </div>
    </div>
  )
}
