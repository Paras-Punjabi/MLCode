import Image from "next/image";
import Link from "next/link";
import { LuLogOut } from "react-icons/lu";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserAvatar,
  SignOutButton,
} from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Banner = () => (
  <div className="flex flex-row gap-2 items-center">
    <Image src="/mlcode-new.svg" width={48} height={48} alt="MLCode Icon" />
    <span className="font-semibold tracking-wide text-2xl bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      MLCode
    </span>
  </div>
)

const links = [
  { label: "Problems", href: "/problemset" },
  { label: "Features", href: "/" },
]

const Navbar = () => (
  <div className="page-gutter-x px-4">
    <div className="flex py-3 items-center justify-between">
      <Link href="/">
        <Banner />
      </Link>
      <nav className="flex flex-wrap items-center text-xl justify-center gap-8">
        {links.map(({ label, href }) => (
          <Link key={label + href} href={href} className="nav-link">
            {label}
          </Link>
        ))}
        <SignedOut>
          <div className="flex flex-row gap-2">
            <SignInButton>
              <Button className="cursor-pointer">Login</Button>
            </SignInButton>
            <SignUpButton>
              <Button className="cursor-pointer">Register</Button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar
                appearance={{
                  elements: {
                    userAvatarBox: {
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                    },
                  },
                }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <SignOutButton>
                    <button className="cursor-pointer flex items-center gap-1">
                      <LuLogOut className="text-red-400" />
                      <span className="text-sm leading-none">Logout</span>
                    </button>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
      </nav>
    </div>
  </div>
);

export default Navbar;
