'use client';

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-content">
        {/* TODO: Add menu items */}
      </div>
    </div>
  );
}
