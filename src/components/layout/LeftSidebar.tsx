import { useState } from 'react';
import { Menu, Search, Layers, Settings, ChevronLeft, ChevronRight, Moon, Sun, X } from 'lucide-react';

interface LeftSidebarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function LeftSidebar({ theme, toggleTheme, isOpenMobile, onCloseMobile }: LeftSidebarProps) {
  const [collapsedDesktop, setCollapsedDesktop] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:relative top-0 left-0 h-full bg-canvas border-r border-border-subtle flex flex-col transition-all duration-300 z-50
          ${/* Mobile: slide from left */ ''}
          ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${/* Desktop: collapsible width */ ''}
          ${collapsedDesktop ? 'md:w-16' : 'md:w-64'}
          w-72 max-w-[80vw]
        `}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border-subtle">
          <span className={`font-bold text-text-primary truncate ${collapsedDesktop ? 'md:hidden' : 'block'}`}>
            Bible Overview 2.0
          </span>

          {/* Desktop Collapse Button */}
          <button 
            onClick={() => setCollapsedDesktop(!collapsedDesktop)} 
            className="hidden md:flex p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-text-secondary"
            title={collapsedDesktop ? "展開側邊欄" : "收合側邊欄"}
          >
            {collapsedDesktop ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={onCloseMobile} 
            className="md:hidden p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto space-y-1">
          <NavItem icon={<Menu size={20} />} label="耶穌家譜" active collapsed={collapsedDesktop} />
          <NavItem icon={<Layers size={20} />} label="支系與分頁 (6)" collapsed={collapsedDesktop} />
          <NavItem icon={<Search size={20} />} label="人物搜尋" collapsed={collapsedDesktop} />
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border-subtle space-y-1">
          <button 
            onClick={toggleTheme} 
            className="flex items-center space-x-3 w-full p-2.5 text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className={`text-sm font-medium ${collapsedDesktop ? 'md:hidden' : 'block'}`}>
              {theme === 'dark' ? '切換淺色模式' : '切換深色模式'}
            </span>
          </button>
          
          <button className="flex items-center space-x-3 w-full p-2.5 text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors">
            <Settings size={18} />
            <span className={`text-sm font-medium ${collapsedDesktop ? 'md:hidden' : 'block'}`}>
              後台管理
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, active, collapsed }: { icon: React.ReactNode, label: string, active?: boolean, collapsed: boolean }) {
  return (
    <div 
      className={`
        flex items-center px-3.5 py-2.5 mx-2 rounded cursor-pointer transition-colors
        ${active ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'}
      `}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className={`ml-3 text-sm truncate ${collapsed ? 'md:hidden' : 'block'}`}>
        {label}
      </span>
    </div>
  );
}
