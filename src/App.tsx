import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Menu } from 'lucide-react';
import LeftSidebar from './components/layout/LeftSidebar';
import Drawer from './components/layout/Drawer';
import GenealogyCanvas from './components/canvas/GenealogyCanvas';
import { mockPersons, mockRelationships } from './data/mockGenealogy';
import { Person } from './types/genealogy';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas">
      {/* Responsive Left Sidebar */}
      <LeftSidebar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Full-Bleed Canvas */}
      <main className="flex-1 relative h-full w-full overflow-hidden">
        {/* Mobile Top Navigation Trigger */}
        <div className="absolute top-4 left-4 z-30 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 bg-canvas/90 backdrop-blur-md border border-border-subtle rounded-xl shadow-md text-text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 active:scale-95 transition-transform"
            aria-label="打開選單"
          >
            <Menu size={20} />
            <span className="text-xs font-semibold">Bible Overview</span>
          </button>
        </div>

        <ReactFlowProvider>
          <GenealogyCanvas 
            persons={mockPersons} 
            relationships={mockRelationships} 
            onSelectPerson={setSelectedPerson} 
          />
        </ReactFlowProvider>
        
        {/* Person Detail Drawer (Bottom sheet on mobile, Right drawer on desktop) */}
        <Drawer person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      </main>
    </div>
  );
}

export default App;
