import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 border rounded-full p-1 bg-background/50 backdrop-blur-sm">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          "p-2 rounded-full transition-all duration-200",
          theme === 'light' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
        )}
        aria-label="Light mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          "p-2 rounded-full transition-all duration-200",
          theme === 'system' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
        )}
        aria-label="System mode"
      >
        <Laptop size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          "p-2 rounded-full transition-all duration-200",
          theme === 'dark' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
        )}
        aria-label="Dark mode"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
