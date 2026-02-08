import { useState, useEffect } from 'react';
import type { TocItem } from '../../utils/blog';

interface TableOfContentsProps {
  items: TocItem[];
}

const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-24">
      <h4 className="text-sm font-semibold text-dark-text-muted uppercase tracking-wider mb-4">
        On this page
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level > 2 ? `${(item.level - 2) * 16}px` : 0 }}>
            <button
              onClick={() => handleClick(item.id)}
              className={`text-sm text-left w-full transition-colors ${
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-dark-text-muted hover:text-dark-text-secondary'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
