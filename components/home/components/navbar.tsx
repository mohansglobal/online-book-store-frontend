"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, type Transition } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  PhoneCall,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { IconButton } from "./icon-button";
import { useCurrentUser, useLogoutModalStore } from "@/features/auth";
import { useCategories } from "@/features/categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  wish: number;
  cart: number;
}

const MOBILE_LINKS = [
  { label: "Home", href: "/#top" },
  { label: "Books", href: "/#books" },
  { label: "Authors", href: "/#authors" },
  { label: "Publishers", href: "/publishers" },
  { label: "Categories", href: "/categories" },
  { label: "Cart", href: "/cart" },
] as const;

const NAVBAR_ANIMATION_TRANSITION: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

let hasNavbarHomeAnimated = false;

export function Navbar({ wish, cart }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user } = useCurrentUser();
  const openLogoutModal = useLogoutModalStore((state) => state.open);

  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useCategories({ limit: 10 });
  const categoriesList = categoriesResponse?.data || [];

  const userAvatar = user?.profilePicture || user?.avatar;

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === "/";
  const shouldAnimate = isHomePage && !hasNavbarHomeAnimated;

  useEffect(() => {
    if (isHomePage) {
      hasNavbarHomeAnimated = true;
    }
  }, [isHomePage]);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  const iconButtonClassName = scrolled
    ? "text-foreground hover:bg-surface-hover hover:border-border"
    : "text-zinc-200 hover:bg-white/10 hover:text-white hover:border-white/20";

  const navLinkClassName = scrolled
    ? "transition-colors hover:text-foreground"
    : "transition-colors hover:text-white";

  return (
    <>
      <motion.nav
        initial={
          shouldAnimate
            ? {
              y: -16,
              opacity: 0,
            }
            : false
        }
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={
          shouldAnimate
            ? NAVBAR_ANIMATION_TRANSITION
            : { duration: 0 }
        }
        className={`fixed inset-x-0 top-0 z-50 h-[76px] transition-all duration-300 ${scrolled
          ? "border-b border-border bg-background/88 shadow-sm backdrop-blur-xl"
          : "border-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
          }`}
      >
        <div className="mx-auto grid h-full w-[min(1420px,calc(100%-44px))] grid-cols-2 items-center md:grid-cols-[1fr_auto_1fr]">
          {/* Brand */}
          <Link
            href="/#top"
            className={`inline-flex w-fit items-center gap-2.5 text-[21px] font-semibold transition-colors ${scrolled ? "text-foreground" : "text-white"
              }`}
          >
            <span
              className={`grid h-[34px] w-[34px] place-items-center rounded-sm transition-colors ${scrolled
                ? "border border-border bg-transparent text-foreground"
                : "border border-white/20 bg-white/10 text-white"
                }`}
            >
              <BookOpen size={18} />
            </span>

            <span>Indo Bangla Books</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className={`hidden gap-[34px] text-[13px] font-medium transition-colors md:flex ${scrolled
              ? "text-muted-foreground"
              : "text-zinc-300"
              }`}
          >
            <Link href="/#top" className={navLinkClassName}>
              Home
            </Link>

            <Link href="/#books" className={navLinkClassName}>
              Books
            </Link>

            <Link
              href="/#authors"
              className={navLinkClassName}
            >
              Authors
            </Link>

            <Link
              href="/publishers"
              className={navLinkClassName}
            >
              Publishers
            </Link>

            {/* Categories Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <Link
                href="/categories"
                onClick={() => setCategoriesOpen(false)}
                className={`${navLinkClassName} -my-4 py-4`}
              >
                Categories
              </Link>

              <div
                className={`absolute top-full left-1/2 z-50 w-max min-w-[300px] -translate-x-1/2 pt-12 transition-all duration-300 ${
                  categoriesOpen
                    ? "visible opacity-100 pointer-events-auto"
                    : "invisible opacity-0 pointer-events-none"
                }`}
              >
                <div className="relative rounded-2xl border border-border bg-background p-4 shadow-2xl md:p-5">
                  {/* Arrow */}
                  <div className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-tl-[3px] border-t border-l border-border bg-background" />

                  {isCategoriesLoading && categoriesList.length === 0 ? (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-4 w-28 rounded bg-muted/60 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : categoriesList.length > 0 ? (
                    <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-3">
                      {categoriesList.slice(0, 10).map((category) => (
                        <Link
                          key={category._id || category.slug}
                          href={`/books?category=${category._id}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="block transform whitespace-nowrap text-[11px] font-semibold tracking-wider text-text-secondary transition-colors duration-200 hover:-translate-y-0.5 hover:text-foreground uppercase"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-2 text-center text-xs text-muted-foreground">
                      No categories found
                    </div>
                  )}

                  {/* See more link */}
                  <div className="relative z-10 mt-4 border-t border-border/70 pt-3">
                    <Link
                      href="/categories"
                      onClick={() => setCategoriesOpen(false)}
                      className="group/more flex items-center justify-between text-[11px] font-bold tracking-wider text-accent transition-colors hover:text-accent-hover uppercase"
                    >
                      <span>See all categories</span>
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover/more:translate-x-0.5 group-hover/more:-translate-y-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 justify-self-end">
            {/* Help */}
            <div
              className={`mr-2 hidden items-center gap-2 border-r pr-4 transition-colors lg:flex ${scrolled
                ? "border-border text-foreground"
                : "border-white/20 text-zinc-200"
                }`}
            >
              <PhoneCall
                size={22}
                className="stroke-[1.5]"
              />

              <div className="flex flex-col justify-center leading-[1.2]">
                <span
                  className={`text-[11px] font-medium italic ${scrolled
                    ? "text-muted-foreground"
                    : "text-zinc-400"
                    }`}
                >
                  For Help
                </span>

                <span
                  className={`text-[14px] font-bold tracking-wide ${scrolled
                    ? "text-blue-600"
                    : "text-gray-300"
                    }`}
                >
                  18001210245
                </span>
              </div>
            </div>

            {/* Search Input */}
            {/* <div
              className={`flex h-11 items-center gap-2.5 overflow-hidden rounded-sm transition-all duration-300 ${scrolled
                ? "border border-border bg-card"
                : "border border-white/20 bg-black/50"
                } ${searchOpen
                  ? "w-[220px] pr-2 pl-3.5 opacity-100 sm:w-[320px]"
                  : "pointer-events-none w-0 p-0 opacity-0"
                }`}
            >
              <Search
                size={18}
                className={`shrink-0 ${scrolled
                  ? "text-muted-foreground"
                  : "text-zinc-400"
                  }`}
              />

              <input
                type="search"
                className={`w-full border-0 bg-transparent text-[13px] outline-none ${scrolled
                  ? "text-foreground placeholder:text-muted-foreground"
                  : "text-white placeholder:text-zinc-400"
                  }`}
                aria-label="Search books"
                autoFocus={searchOpen}
                placeholder="Search books, authors or publishers…"
              />

              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className={`grid cursor-pointer place-items-center border-0 bg-transparent ${scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-zinc-400 hover:text-white"
                  }`}
              >
                <X size={17} />
              </button>
            </div> */}

            {!searchOpen && (
              <IconButton
                label="Search"
                onClick={() => setSearchOpen(true)}
                className={iconButtonClassName}
              >
                <Search size={19} />
              </IconButton>
            )}

            <IconButton
              label="Wishlist"
              count={wish}
              className={iconButtonClassName}
            >
              <Heart size={19} />
            </IconButton>

            <IconButton
              label="Shopping cart"
              count={cart}
              onClick={() => router.push("/cart")}
              className={iconButtonClassName}
            >
              <ShoppingBag size={19} />
            </IconButton>

            {user ? (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="Open user menu"
                      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${scrolled
                          ? "hover:bg-muted"
                          : "hover:bg-white/10"
                        }`}
                    >
                      {userAvatar ? (
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={userAvatar}
                            alt={user.name || "User avatar"}
                            fill
                            sizes="32px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64 rounded-xl p-1.5 shadow-lg"
                  >
                    <DropdownMenuLabel className="p-3 font-normal">
                      <div className="flex items-center gap-3">
                        {userAvatar ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={userAvatar}
                              alt={user.name || "User avatar"}
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {user.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {user.role}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {user.role === "SELLER" && (
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                        className="h-9 cursor-pointer rounded-lg px-2.5"
                      >
                        <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        Seller Dashboard
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={() => openLogoutModal()}
                      className="h-9 cursor-pointer rounded-lg px-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="mr-2.5 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:block">
                <IconButton
                  label="Log in"
                  onClick={() => router.push("/login")}
                  className={iconButtonClassName}
                >
                  <User size={19} />
                </IconButton>
              </div>
            )}

            <div className="md:hidden">
              <IconButton
                label="Menu"
                onClick={() => setMenuOpen(true)}
                className={iconButtonClassName}
              >
                <Menu size={20} />
              </IconButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-between overflow-y-auto bg-background p-7">
          <div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute top-[22px] right-[22px] grid h-12 w-12 cursor-pointer place-items-center border-0 bg-transparent text-foreground"
            >
              <X size={24} />
            </button>

            <div className="pt-10">
              {MOBILE_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-border py-3 font-display text-[36px] leading-[1.35] text-foreground transition-colors hover:text-primary sm:text-[44px]"
                >
                  {label}

                  <ArrowUpRight size={24} />
                </Link>
              ))}
            </div>
          </div>

          {user ? (
            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
              <div className="flex items-center gap-3">
                {userAvatar ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                    <Image
                      src={userAvatar}
                      alt={user.name || "User avatar"}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </div>
              {user.role === "SELLER" && (
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-surface px-4 py-2.5 text-sm font-medium text-foreground"
                >
                  <LayoutDashboard size={16} />
                  Seller Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openLogoutModal();
                }}
                className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive text-left cursor-pointer"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-8 border-t border-border pt-6">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white"
              >
                <User size={18} />
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}