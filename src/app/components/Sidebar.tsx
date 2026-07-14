import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Menu, UserRound, X } from "lucide-react";
import addExpenseIcon from "../../assets/add expense.png";
import captainsLogIcon from "../../assets/captains log.png";
import dashboardIcon from "../../assets/dashboard.png";
import insightsIcon from "../../assets/insights.png";
import orangeLogo from "../../assets/orange.png";
import treasureVaultIcon from "../../assets/treasure vault.png";

const navItems = [
  { iconSrc: dashboardIcon, label: "Dashboard", path: "/" },
  { iconSrc: addExpenseIcon, label: "Add Expense", path: "/add" },
  { iconSrc: insightsIcon, label: "Insights", path: "/insights" },
  { iconSrc: treasureVaultIcon, label: "Treasure Vault", path: "/vault" },
  { iconSrc: captainsLogIcon, label: "Captain's Log", path: "/ai" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const goTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const linkClass = (active: boolean) =>
    `group flex min-h-12 w-full items-center gap-3 rounded-[18px] px-4 text-left text-sm font-bold transition-all ${
      active
        ? "bg-gradient-to-r from-[#FFF0E5] to-[#FFF7F0] text-primary shadow-[0_6px_18px_rgba(255,140,66,0.10)]"
        : "text-foreground hover:bg-accent/70 hover:text-primary"
    }`;

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 flex size-11 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-[0_8px_24px_rgba(255,140,66,0.12)] md:hidden"
      >
        <Menu className="size-5" />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border bg-sidebar shadow-[18px_0_50px_rgba(255,140,66,0.06)] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-7 py-7">
          <button onClick={() => goTo("/")} className="flex items-center gap-3 text-left" aria-label="Go to dashboard">
            <img src={orangeLogo} alt="" className="size-11 object-contain" />
            <span>
              <span className="block text-xl font-extrabold tracking-tight text-primary">Berry Vault</span>
              <span className="mt-0.5 block text-xs font-medium text-muted-foreground">Protect your treasure</span>
            </span>
          </button>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-primary md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-5 py-6" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => goTo(item.path)} className={linkClass(isActive)}>
                <img
                  src={item.iconSrc}
                  alt=""
                  className={`size-6 shrink-0 object-contain transition-opacity ${isActive ? "opacity-100" : "opacity-85 group-hover:opacity-100"}`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border px-5 py-5">
          <button onClick={() => goTo("/profile")} className={linkClass(location.pathname === "/profile")}>
            <UserRound className={`size-6 ${location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"}`} />
            Profile
          </button>
        </div>
      </aside>
    </>
  );
}
