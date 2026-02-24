import Link from "next/link";
import BrandLogo from "../BrandLogo";
import { SignedIn, SignedOut, SignInButton, SignUpButton, } from "@clerk/nextjs";
import { Button } from "../ui/button";
import UserMenu from "./UserMenu";

const links = [
  { label: "Problems", href: "/problemset" },
  { label: "Features", href: "/" },
]

export default function Navbar() {
  return (
    <div className="sticky page-gutter-x">
      <nav className="flex flex-row h-16 items-center justify-between">
        <Link href='/'>
          <div className="flex flex-row gap-1 items-center">
            <BrandLogo className="size-10 text-primary" />
            <span className="text-xl font-semibold font-decor text-primary">MLCode</span>
          </div>
        </Link>
        <div className="flex flex-wrap items-center text-xl justify-center gap-8">
          {links.map(({ label, href }) => (
            <Link key={label + href} href={href} className="nav-link">
              {label}
            </Link>
          ))}
          <SignedOut>
            <div className="flex flex-row gap-2">
              <SignUpButton>
                <Button variant="outline" className="cursor-pointer">Register</Button>
              </SignUpButton>
              <SignInButton>
                <Button className="cursor-pointer">Login</Button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}
