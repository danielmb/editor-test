'use client';
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { useEditor } from './editor';

const CustomStyle = {
  display: 'flex',
  // width: '600px',
  // height: '600px',
  // a4 size
  width: '21cm',
  height: '29.7cm',
  // background: 'green',
};

export function CreateGrid() {
  const { grid } = useEditor();
  // use css to create grid overlay use background for grid lines
  const gridWidth = 1;
  const transparentSpace = 2;
  const gridStyle = {
    // backgroundImage: ` linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px);`,
    backgroundImage: `linear-gradient(to right, grey ${gridWidth}px, transparent ${transparentSpace}px), linear-gradient(to bottom, grey ${gridWidth}px, transparent ${transparentSpace}px)`,
    backgroundSize: `${grid}px ${grid}px`,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  } satisfies React.CSSProperties;

  return <div style={gridStyle} />;
}

export function Droppable({ children }: React.PropsWithChildren) {
  const { showGrid } = useEditor();
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={CustomStyle}
      className={cn('flex border-2 relative', isOver && 'bg-green-200')}
    >
      {children}
      {showGrid && <CreateGrid />}
    </div>
  );
}
