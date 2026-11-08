import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Person } from '../../types/genealogy';
import { ChevronDown, ExternalLink } from 'lucide-react';

type CustomPersonNodeProps = NodeProps & {
  data: {
    person: Person;
    isExpanded?: boolean;
    hasChildren?: boolean;
    onToggleExpand?: (id: string) => void;
    onClickDetails?: (person: Person) => void;
  };
};

function CustomPersonNode({ data, id }: CustomPersonNodeProps) {
  const { person, isExpanded, hasChildren, onToggleExpand, onClickDetails } = data;
  
  // Determine border color based on source
  let sourceBorderClass = 'border-border-subtle';
  let sourceBgClass = 'bg-canvas';
  
  if (person.sourceTraditions.includes('both')) {
    sourceBgClass = 'bg-source-shared';
  } else if (person.sourceTraditions.includes('luke')) {
    sourceBgClass = 'bg-source-luke';
  } else if (person.sourceTraditions.includes('matthew')) {
    sourceBgClass = 'bg-source-matthew';
  } else if (person.sourceTraditions.includes('other')) {
    sourceBgClass = 'bg-source-other';
  }

  const isCrucial = person.importance === 'crucial';
  const isImportant = person.importance === 'important';
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleExpand) onToggleExpand(id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClickDetails) onClickDetails(person);
  };

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div 
        onClick={handleCardClick}
        className={`w-[140px] h-[56px] rounded flex overflow-hidden shadow-sm hover:shadow transition-shadow bg-canvas cursor-pointer border ${isCrucial ? 'border-accent-rose border-4' : isImportant ? 'border-accent-rose border-2' : 'border-border-subtle'}`}
      >
        {/* Source color indicator (left side) */}
        <div className={`w-2 h-full ${sourceBgClass}`} />
        
        {/* Content */}
        <div className="flex-1 px-2 py-1 flex flex-col justify-center min-w-0">
          <div className="text-sm font-semibold text-text-primary truncate">{person.nameZh}</div>
          <div className="text-[11px] text-text-secondary truncate">{person.nameEn}</div>
        </div>

        {/* Subtree Link Icon */}
        {person.hasSubtreeView && (
          <div className="absolute -right-2 -top-2 bg-blue-100 p-1 rounded-full border border-blue-300 text-blue-600">
            <ExternalLink size={12} />
          </div>
        )}
      </div>

      {hasChildren && (
        <div 
          onClick={handleToggle}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-canvas border border-border-subtle rounded-full p-0.5 cursor-pointer hover:bg-gray-100 shadow-sm z-10"
        >
          <ChevronDown 
            size={14} 
            className={`text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

export default memo(CustomPersonNode);
