'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
    <line x1="3" x2="21" y1="10" y2="10" /><line x1="3" x2="21" y1="14" y2="14" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M17 7 7 17" /><path d="m7 7 10 10" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const handleThemeChange = () => {
    document.documentElement.classList.add('theme-transition');
    setTheme(isDark ? 'light' : 'dark');
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 220);
  };

  return (
    <button
      type="button"
      onClick={handleThemeChange}
      className="flex h-9 w-9 items-center justify-center rounded-sm text-foreground transition-colors duration-200 hover:bg-foreground/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="transition-transform duration-200" aria-hidden="true">
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

function ThemeLogo({ className, priority = false }: { className: string; priority?: boolean }) {
  const { resolvedTheme } = useTheme();
  const logoSource = resolvedTheme === 'light' ? '/lr-logo-light.svg' : '/lr-logo-dark.svg';

  return (
    <Image
      src={logoSource}
      alt="LR Logo"
      width={48}
      height={48}
      className={className}
      priority={priority}
    />
  );
}

const DesktopNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-1.5 text-[13px] tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm ${
        isActive 
          ? 'font-medium text-foreground' 
          : 'font-medium text-muted-foreground hover:text-foreground'
      }`}
    >
      <span>{children}</span>
      {isActive ? (
        <span className="h-1 w-1 rounded-full bg-foreground" />
      ) : (
        <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true">
          →
        </span>
      )}
    </Link>
  );
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Transparent-to-solid transition
      setIsScrolled(currentScrollY > 20);

      if (isMobileMenuOpen) return;

      // Predictable scroll direction logic
      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scroll down -> hide
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);  // Scroll up -> show
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const mobileNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Research', href: '/research' },
    { name: 'About', href: '/about' },
    { name: 'Progress', href: '/progress' },
    { name: 'Contact', href: '/contact' },
  ];
  
  const desktopNavItems = mobileNavItems.filter(item => item.name !== 'Home');

  return (
    <>
      <header 
        className={`fixed top-0 z-50 w-full transform transition-transform duration-[180ms] ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div 
          className={`w-full transition-all duration-500 ${
            isScrolled 
              ? 'bg-background/85 backdrop-blur-md border-b border-border/50' 
              : 'bg-transparent border-transparent'
          }`}
        >
          <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
            
            {/* Brand Identity */}
            <div className="flex items-center gap-4">

              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm"
              >
                      <ThemeLogo className="h-14 w-auto" priority />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {desktopNavItems.map((item) => (
                <DesktopNavLink key={item.name} href={item.href}>
                  {item.name}
                </DesktopNavLink>
              ))}
              
              <Link 
                href="/contribute" 
                className="group flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-foreground transition-colors ml-4 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm"
              >
                <span>Contribute</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
                  ↗
                </span>
              </Link>

              <ThemeToggle />
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 -mr-2 text-foreground md:hidden relative z-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      <div 
        id="mobile-navigation"
        className={`fixed inset-0 z-40 flex flex-col bg-background px-6 pt-[104px] pb-12 transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex-1 flex flex-col gap-8">
          {mobileNavItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-baseline gap-6 transform transition-all duration-500 ease-out focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm w-fit ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <span className="text-sm font-medium text-muted-foreground w-6">
                  0{i + 1}
                </span>
                <span className={`text-3xl tracking-wide transition-colors ${
                  isActive ? 'font-medium text-foreground' : 'font-medium text-muted-foreground'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}

          <div 
            className={`pt-8 mt-4 border-t border-border/50 transform transition-all duration-500 ease-out ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: `${mobileNavItems.length * 50}ms` }}
          >
            <Link 
              href="/contribute" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-2xl font-medium tracking-wide text-foreground w-fit focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground focus-visible:outline-offset-4 rounded-sm"
            >
              <span>Contribute</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={`mt-8 flex items-center border-t border-border/50 pt-6 transform transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <ThemeToggle />
          </div>
        </nav>

        {/* Identity Footer */}
        <div 
          className={`transform transition-all duration-700 ease-out delay-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 text-[13px] font-medium tracking-wide text-muted-foreground">
            <span className="text-foreground">LR Research</span>
            <span>Researching what comes next.</span>
          </div>
        </div>
      </div>
    </>
  );
}