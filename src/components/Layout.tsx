import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
