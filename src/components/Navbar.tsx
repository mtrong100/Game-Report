import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PieChart, Menu, X, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: LayoutDashboard },
    { path: '/analytics', label: 'Thống kê', icon: PieChart },
    { path: '/export', label: 'Xuất dữ liệu', icon: Download },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-105">
              <img src="/logo.svg" alt="Game Report Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="font-bold text-lg md:text-xl hidden sm:inline-block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Game Report
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
