import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Active, useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  SaveIcon,
  TrashIcon,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  XIcon,
} from 'lucide-react';
import { Note, useNote } from './editor';
interface DraggableProps {
  id: string;
  styles: React.CSSProperties;
}
interface TextEditorProps {
  id: string;
}

export function ImageEditor({ id }: TextEditorProps) {
  const {
    editingNoteId,
    setEditingNoteId,
    notes,
    setNotes,
    isEditing,
    note,
    arrayOptions: { moveDown, moveFirst, moveLast, moveUp, remove, update },
  } = useNote({
    id,
  });

  const [image, setImage] = useState(note?.type === 'image' ? note.image : '');

  const updateImage = () => {
    update(note?.id ?? '', (note) => {
      return {
        ...note,
        image,
      };
    });
    setEditingNoteId(null);
  };

  return (
    <div
      // onMouseDown={onClick}
      // ref={setNodeRef}
      className={cn('flex flex-col')}
      // {...listeners}
      // {...attributes}
    >
      <Input
        type="text"
        value={image}
        // onChange={(e) => console.log(e.target.value)}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setEditingNoteId(null);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            updateImage();
            setEditingNoteId(null);
          }
        }}
        onChange={(e) => {
          setImage(e.target.value);
        }}
      />
      {/* Options */}
      <div className="flex  p-2 space-x-2 w-52">
        <Button variant={'destructive'} onClick={() => setEditingNoteId(null)}>
          <XIcon />
        </Button>
        <Button
          variant={'default'}
          onClick={() => {
            updateImage();
            setEditingNoteId(null);
          }}
        >
          <SaveIcon />
        </Button>
        <Button
          variant={'destructive'}
          onClick={() => {
            remove();
          }}
        >
          <TrashIcon />
        </Button>
        <div className="flex space-x-2">
          <Button
            variant={'default'}
            onClick={() => {
              moveUp();
            }}
          >
            <ChevronDown />
          </Button>
          <Button
            variant={'default'}
            onClick={() => {
              moveDown();
            }}
          >
            <ChevronUp />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TextEditor({ id }: TextEditorProps) {
  const {
    editingNoteId,
    setEditingNoteId,
    notes,
    setNotes,
    isEditing,
    note,
    arrayOptions: { moveDown, moveFirst, moveLast, moveUp, remove, update },
  } = useNote({
    id,
  });

  const [editingContent, setEditingContent] = useState(
    note?.type === 'text' ? note.content : '',
  );

  const saveNote = () => {
    update(note?.id ?? '', (note) => {
      return {
        ...note,
        content: editingContent,
      };
    });
    setEditingNoteId(null);
  };
  return (
    <div
      // onMouseDown={onClick}
      // ref={setNodeRef}
      className={cn('flex flex-col')}
      // {...listeners}
      // {...attributes}
    >
      {/* <div>
          <p>{note?.id}</p>
        </div> */}
      <Input
        type="text"
        value={editingContent}
        // onChange={(e) => console.log(e.target.value)}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setEditingNoteId(null);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            saveNote();
            setEditingNoteId(null);
          }
        }}
        onChange={(e) => {
          setEditingContent(e.target.value);
        }}
      />
      {/* Options */}
      <div className="flex  p-2 space-x-2 w-52">
        <Button variant={'destructive'} onClick={() => setEditingNoteId(null)}>
          <XIcon />
        </Button>
        <Button
          variant={'default'}
          onClick={() => {
            saveNote();
            setEditingNoteId(null);
          }}
        >
          <SaveIcon />
        </Button>
        <Button
          variant={'destructive'}
          onClick={() => {
            remove();
          }}
        >
          <TrashIcon />
        </Button>
        <div className="flex space-x-2">
          <Button
            variant={'default'}
            onClick={() => {
              moveUp();
            }}
          >
            <ChevronDown />
          </Button>
          <Button
            variant={'default'}
            onClick={() => {
              moveDown();
            }}
          >
            <ChevronUp />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Draggable({ id, styles }: DraggableProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [gridAlreadyEnabled, setGridAlreadyEnabled] = useState(false);
  const {
    editingNoteId,
    setEditingNoteId,
    notes,
    setNotes,
    isEditing,
    note,
    setShowGrid,
    showGrid,
    arrayOptions: { moveDown, moveFirst, moveLast, moveUp, remove, update },
  } = useNote({
    id,
  });
  const { isDragging, setNodeRef, listeners, attributes, transform } =
    useDraggable({
      id,
      // disabled: editingNoteId === id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  const onClick = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      setEditingNoteId(id);
    }
  };

  // useEffect(() => {
  //   if (isDragging && !gridAlreadyEnabled) {
  //     setShowGrid(true);
  //     setGridAlreadyEnabled(true);
  //   }
  // }, [isDragging, setShowGrid, gridAlreadyEnabled]);
  // useEffect(() => {
  //   if (!isDragging && gridAlreadyEnabled) {
  //     setShowGrid(false);
  //   }
  // }, [showGrid, isDragging]);
  // The problem we need to solve is that when we drag the note, the grid will be shown. BUT when we stop dragging the note the showGrid will return to its original boolean
  useEffect(() => {
    if (isDragging) {
      setShowGrid((prev) => {
        setGridAlreadyEnabled(prev);
        return true;
      });
    }
    if (!isDragging) {
      setGridAlreadyEnabled((gridAlreadyEnabledPrev) => {
        setShowGrid((prev) => {
          return gridAlreadyEnabledPrev;
        });
        return false;
      });
    }
  }, [isDragging, setShowGrid]);
  return (
    <div
      onMouseDown={onClick}
      ref={setNodeRef}
      style={{ ...style, ...styles }}
      // className="flex"
      className={cn(`flex select-none`, isDragging && 'bg-blue-200')}
      // {...listeners}
      {...(!isEditing && { ...listeners })}
      {...attributes}
    >
      {!isEditing && (
        <>
          {note?.type === 'text' && <p>{note?.content}</p>}
          {note?.type === 'image' && (
            <img
              src={note?.image}
              alt="note"
              width={note?.width}
              height={note?.height}
            />
          )}
        </>
      )}
      {isEditing && <TextEditor id={id} />}
    </div>
  );
}
