import { useState, useCallback, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Person, Relationship } from '../types/genealogy';

// A simple local layout for Phase 1. Real app will use ELKjs or Dagre.
export function useCanvasLayout(persons: Person[], relationships: Relationship[]) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['adam', 'noah']));

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const calculateLayout = useCallback((onDetails: (p: Person) => void) => {
    // Very naive layout just for prototype phase 1 (Genesis 1-11)
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Manual positions for the mock data spine to prove concept
    const posMap: Record<string, {x: number, y: number}> = {
      'god': {x: 300, y: 0},
      'adam': {x: 300, y: 100},
      'eve': {x: 460, y: 100}, // Spouse
      'cain': {x: 100, y: 200},
      'abel': {x: 250, y: 200},
      'seth': {x: 400, y: 200},
      'enosh': {x: 400, y: 300},
      'kenan': {x: 400, y: 400},
      'mahalalel': {x: 400, y: 500},
      'jared': {x: 400, y: 600},
      'enoch': {x: 400, y: 700},
      'methuselah': {x: 400, y: 800},
      'lamech': {x: 400, y: 900},
      'noah': {x: 400, y: 1000},
      'japheth': {x: 200, y: 1100},
      'shem': {x: 400, y: 1100},
      'ham': {x: 600, y: 1100},
    };

    // Determine children
    const childMap: Record<string, string[]> = {};
    relationships.forEach(r => {
      if (r.type === 'parent_child') {
        if (!childMap[r.fromPersonId]) childMap[r.fromPersonId] = [];
        childMap[r.fromPersonId].push(r.toPersonId);
      }
    });

    persons.forEach(p => {
      // For prototype, only show if they have a position
      if (posMap[p.id]) {
        // Simple hiding logic based on expanded nodes
        let isVisible = true;
        // If they are children of adam, adam must be expanded
        if (['cain', 'abel', 'seth'].includes(p.id) && !expandedNodes.has('adam')) isVisible = false;
        // If they are descendents of seth, seth must be expanded - simplified for demo
        if (['enosh', 'kenan', 'mahalalel', 'jared', 'enoch', 'methuselah', 'lamech', 'noah'].includes(p.id) && !expandedNodes.has('adam')) isVisible = false; 
        if (['japheth', 'shem', 'ham'].includes(p.id) && (!expandedNodes.has('adam') || !expandedNodes.has('noah'))) isVisible = false;

        if (isVisible) {
          const hasChildren = (childMap[p.id]?.length || 0) > 0;
          newNodes.push({
            id: p.id,
            type: 'customPerson',
            position: posMap[p.id],
            data: {
              person: p,
              hasChildren,
              isExpanded: expandedNodes.has(p.id),
              onToggleExpand: handleToggleExpand,
              onClickDetails: onDetails
            }
          });
        }
      }
    });

    // Generate edges for visible nodes
    relationships.forEach(r => {
      if (newNodes.find(n => n.id === r.fromPersonId) && newNodes.find(n => n.id === r.toPersonId)) {
        newEdges.push({
          id: r.id,
          source: r.fromPersonId,
          target: r.toPersonId,
          type: 'customEdge',
          data: { type: r.type, certainty: r.certainty }
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [persons, relationships, expandedNodes, handleToggleExpand]);

  return { nodes, edges, onNodesChange: setNodes, onEdgesChange: setEdges, calculateLayout };
}
