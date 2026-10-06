'use client';

import { motion, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActiveSection } from '@/lib/hooks';
import AvailabilityBadge from '@/components/ui/AvailabilityBadge';

export default function MobileNav() {
  const pathname = usePathname();
  const { activeSection, navItems } = useActiveSection();
  const isHome = pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] lg:hidden backdrop-blur-sm" style={{ background: 'color-mix(in srgb, var(--ground) 94%, transparent)', borderBottom: '1px solid var(--rule)' }} aria-label="Mobile navigation">
      <div className="flex items-center px-3 py-3">
        {isHome ? (
          <AvailabilityBadge />
        ) : (
          <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase" style={{ borderColor: 'var(--rule)', color: 'var(--ink-faint)' }}>
            Home
          </Link>
        )}
        <div className="flex-1 overflow-x-auto hide-scrollbar">
          <LayoutGroup id="mobile-nav">
            <ul className="flex items-center gap-8 px-4 py-1 whitespace-nowrap relative">
              {navItems.map((item) => {
                const isActive = activeSection === item.id && isHome;
                const href = isHome ? item.href : (item.href.startsWith('#') ? `/${item.href}` : item.href);
                return (
                  <li key={item.id} className="relative py-1">
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className="text-sm block transition-colors duration-200"
                      style={{ letterSpacing: '0.1em', color: isActive ? 'var(--ink-strong)' : 'var(--ink-faint)' }}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="absolute -bottom-[-2px] left-0 right-0 h-[2px]"
                          style={{ background: 'var(--ink-strong)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none opacity-40" style={{ background: 'linear-gradient(to left, var(--ground), transparent)' }} />
    </nav>
  );
}
