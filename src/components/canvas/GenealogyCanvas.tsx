import { useMemo, useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, useReactFlow } from '@xyflow/react';
import CustomPersonNode from './CustomPersonNode';
import CustomEdge from './CustomEdge';
import ZoomControls from '../ui/ZoomControls';
import { Person, Relationship } from '../../types/genealogy';
import { useCanvasLayout } from '../../hooks/useCanvasLayout';

interface GenealogyCanvasProps {
  persons: Person[];
  relationships: Relationship[];
  onSelectPerson: (person: Person) => void;
}

const nodeTypes = { customPerson: CustomPersonNode };
const edgeTypes = { customEdge: CustomEdge };

export default function GenealogyCanvas({ persons, relationships, onSelectPerson }: GenealogyCanvasProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, calculateLayout } = useCanvasLayout(persons, relationships);
  const { fitView } = useReactFlow();

  useEffect(() => {
    calculateLayout(onSelectPerson);
  }, [calculateLayout, onSelectPerson]);

  useEffect(() => {
    // Only fit view once on initial load when nodes are populated
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border-subtle)" />
        <ZoomControls />
      </ReactFlow>
    </div>
  );
}
