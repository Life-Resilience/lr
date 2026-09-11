'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Clean, geometric SVG icons
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

// Desktop Navigation Link with subtle hover motion and active dot indicator
const DesktopNavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-1.5 text-[13px] tracking-wide transition-all duration-300 ${
        isActive 
          ? 'font-semibold text-foreground' 
          : 'font-medium text-muted-foreground hover:text-foreground'
      }`}
    >
      <span>{children}</span>
      {isActive ? (
        <span className="h-1 w-1 rounded-full bg-foreground" />
      ) : (
        <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
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

  // Handle scroll state for visibility and architectural transparent-to-solid transition
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Handle transparent-to-solid transition
      setIsScrolled(currentScrollY > 20);

      // Do not hide the navbar if the mobile menu is currently open
      if (isMobileMenuOpen) return;

      // Handle showing/hiding based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 72) {
        // Scrolling down past the header height -> hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // Desktop omits "Home", Mobile includes it
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
      {/* 
        Main Header 
        Sits at z-50. Transitions from transparent to blurred/bordered on scroll. 
        Also translates up and out of view when scrolling down.
      */}
      <header 
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/85 backdrop-blur-md border-b border-border/50' 
            : 'bg-transparent border-transparent'
        } ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center"
            >
              <Image 
                src="/lr-logo.svg" 
                alt="LR Logo" 
                width={48} 
                height={48} 
                className="h-14 w-auto" 
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {desktopNavItems.map((item) => (
              <DesktopNavLink key={item.name} href={item.href}>
                {item.name}
              </DesktopNavLink>
            ))}
            
            {/* Action Item - Text based, no rounded button styling */}
            <Link 
              href="/contribute" 
              className="group flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-foreground transition-colors ml-4"
            >
              <span>Contribute</span>
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 -mr-2 text-foreground md:hidden relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* 
        Mobile Navigation Panel 
        Full screen takeover, mounted but pointer-events toggled for smooth CSS transitions
      */}
      <div 
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
                className={`flex items-baseline gap-6 transform transition-all duration-500 ease-out ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <span className="text-sm font-medium text-muted-foreground w-6">
                  0{i + 1}
                </span>
                <span className={`text-3xl tracking-wide transition-colors ${
                  isActive ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
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
              className="flex items-center gap-3 text-2xl font-medium tracking-wide text-foreground"
            >
              <span>Contribute</span>
              <span>→</span>
            </Link>
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