import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
  Boxes,
  Calendar,
  ChartColumnIncreasing,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  ScrollText,
  Settings,
  ShoppingBag,
  ShoppingCart,
  StoreIcon,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
};

const navItems: NavItem[] = [
  { icon: <LayoutDashboard />, name: "Dashboard", path: "/" },
  { icon: <ShoppingCart />, name: "Inventory", path: "/inventory" },
  { icon: <ChartColumnIncreasing />, name: "Sales", path: "/sales" },
  { icon: <ShoppingBag />, name: "Purchase", path: "/purchase" },
  { icon: <NotebookPen />, name: "Reports", path: "/reports" },
  { icon: <Calendar />, name: "Calendar", path: "/calendar" },
  { icon: <StoreIcon />, name: "Suppliers", path: "/suppliers" },
  { icon: <Boxes />, name: "Categories", path: "/categories" },
  { icon: <ScrollText />, name: "Invoice", path: "/profile" },
  { icon: <Settings />, name: "Settings", path: "/settings" },
  { icon: <CircleUserRound />, name: "Profile", path: "/profile" },
  { icon: <LogOut />, name: "Logout", path: "/signin" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex gap-4 justify-between items-center">
              <img src="/images/logo/logo-icon.svg" alt="Logo" width={40} height={40} /><span className="text-black dark:text-white font-bold text-lg">GROCERY-STORE</span>
            </div>
          ) : (
            <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {navItems.map((nav) => (
              <Link
                to={nav.path || "#"}
                key={nav.name}
                className={`menu-item group ${isActive(nav.path || "") ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span className={`menu-item-icon-size ${isActive(nav.path || "") ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;