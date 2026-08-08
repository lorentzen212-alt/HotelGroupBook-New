import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/hotelgroupbook-logo.png";

export function SiteShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, profile, user, signOut } = useAuth();
  const label = profile?.first_name || user?.email || "Account";

  return (
    <div className="min-h-screen bg-[#0A0B0D] font-[Inter]">
      <header className="flex items-center justify-between gap-4 border-b border-[rgba(201,147,34,0.2)] px-5 py-4 sm:px-8">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="HotelGroupBook" className="h-[56px] w-auto sm:h-[68px]" />
        </Link>
        <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-[#B9C2CC]">
          <Link to="/manage-bookings" className="hidden hover:text-[#F1D77A] sm:inline">
            My bookings
          </Link>
          {isAuthenticated ? (
            <>
              <span className="hidden text-[#8B949E] sm:inline">{label}</span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-md border border-[rgba(201,147,34,0.4)] px-3 py-1.5 text-[#F5F3EE] hover:text-[#F1D77A]"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              search={{ next: "/manage-bookings", mode: "signin" }}
              className="rounded-md border border-[rgba(201,147,34,0.4)] px-3 py-1.5 text-[#F5F3EE] hover:text-[#F1D77A]"
            >
              Sign in
            </Link>
          )}
        </nav>
      </header>
      <main className="px-5 py-12 sm:px-8">{children}</main>
    </div>
  );
}