import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export default function CustomEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;
  
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const isDisputed = data?.certainty === 'disputed';
  const isSpouse = data?.type === 'spouse';

  return (
    <BaseEdge
      path={edgePath}
      style={{
        stroke: 'var(--edge-default)',
        strokeWidth: 1.5,
        strokeDasharray: isDisputed ? '5,5' : (isSpouse ? '2,2' : 'none'),
      }}
    />
  );
}
