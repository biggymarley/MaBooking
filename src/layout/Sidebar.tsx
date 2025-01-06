// components/layout/Sidebar.tsx
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import {
    Building,
    CalendarRange,
    Home,
    Menu
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ to, icon, children }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
      )
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: <Home className="h-4 w-4" />, label: "Rooms Listing" },
    { to: "/rooms", icon: <Building className="h-4 w-4" />, label: "Room Management" },
    { to: "/bookings", icon: <CalendarRange className="h-4 w-4" />, label: "Booking Management" },
  ];

  const NavContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col fixed left-0">
        <div className="flex h-full flex-col border-r bg-white dark:bg-gray-900">
          <NavContent />
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

// components/layout/Layout.tsx
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
};

export { Layout, Sidebar };
