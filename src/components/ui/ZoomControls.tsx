import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

export default function ZoomControls() {
  const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();

  const handleReset = () => {
    // Reset to Adam roughly
    setCenter(300, 100, { zoom: 1, duration: 800 });
  };

  return (
    <div className="absolute bottom-6 left-6 z-10 flex flex-col bg-canvas border border-border-subtle rounded shadow-sm overflow-hidden">
      <button onClick={() => zoomIn({ duration: 300 })} className="p-2 hover:bg-gray-100 text-text-secondary border-b border-border-subtle" title="放大">
        <ZoomIn size={18} />
      </button>
      <button onClick={() => zoomOut({ duration: 300 })} className="p-2 hover:bg-gray-100 text-text-secondary border-b border-border-subtle" title="縮小">
        <ZoomOut size={18} />
      </button>
      <button onClick={() => fitView({ duration: 800, padding: 0.2 })} className="p-2 hover:bg-gray-100 text-text-secondary border-b border-border-subtle" title="適合畫面">
        <Maximize size={18} />
      </button>
      <button onClick={handleReset} className="p-2 hover:bg-gray-100 text-text-secondary" title="回到起點">
        <RotateCcw size={18} />
      </button>
    </div>
  );
}
