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

const Navbar = () => {
  return (
    <>
      <div className="container mx-auto flex flex-wrap px-1 py-3 flex-col md:flex-row items-center">
        <Image src={"/mlcode.svg"} width={120} height={120} alt="MLCode Icon" />
        <Link
          href={"/"}
          className="ml-[-0.5%] font-bold text-4xl bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          MLCode
        </Link>
        <nav className="md:ml-auto flex mr-5 flex-wrap items-center text-xl justify-center gap-2">
          <Link
            href={"/"}
            className="px-5 py-2 rounded-md cursor-pointer hover:text-white hover:bg-white/10 transition-colors"
          >
            Problems
          </Link>
          <Link
            href={"/"}
            className="px-5 py-2 rounded-md cursor-pointer hover:text-white hover:bg-white/10 transition-colors"
          >
            Features
          </Link>
          <SignedOut>
            <SignInButton>
              <button className="px-5 py-2 rounded-md cursor-pointer bg-gray-800 text-white font-semibold transition-colors">
                Login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-5 py-2 rounded-md cursor-pointer bg-gray-800 text-white font-semibold transition-colors">
                Register
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
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
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuSeparator />
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
    </>
  );
};

export default Navbar;
