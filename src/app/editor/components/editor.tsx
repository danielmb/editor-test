'use client';
import React, { useMemo, useState } from 'react';
import {
  Active,
  DndContext,
  DragEndEvent,
  MouseSensor,
  PointerSensor,
  UseDraggableArguments,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import crypto, { randomUUID } from 'crypto';
interface Position {
  x: number;
  y: number;
}

interface BaseNote {
  id: string;
  position: Position;
}

interface NoteWithText extends BaseNote {
  content: string;
  type: 'text';
}

interface NoteWithImage extends BaseNote {
  image: string;
  type: 'image';

  width: number;
  height: number;
}

export type Note = NoteWithText | NoteWithImage;

const notesData = [
  {
    id: '1',
    content: 'Study English',
    position: {
      x: 0,
      y: 0,
    },
    type: 'text',
  },
] satisfies NoteWithText[];
import {
  parseAsFloat,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
  parseAsString,
  useQueryState,
} from 'nuqs';
import { Button } from '@/components/ui/button';
import { EditorOptions } from './editor-options';
import { createEditorContext } from './editor-context';

// export const EditorContext = React.createContext<{
//   notes: Note[];
//   setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
//   setEditingNoteId: React.Dispatch<React.SetStateAction<Active['id'] | null>>;
//   editingNoteId: Active['id'] | null;
// }>({
//   notes: [],
//   setNotes: () => {},
//   // setEditingNote: () => {},
//   setEditingNoteId: () => {},
//   editingNoteId: null,
// });
// // NOW WITH GENERICS!!

// interface UseEditorProps {
//   id?: Active['id'] | null;
//   draggableOptions?: UseDraggableArguments;
// }
// export const useNote = (props: UseEditorProps = { id: null }) => {
//   const { notes, setNotes, setEditingNoteId, editingNoteId } =
//     React.useContext(EditorContext);

//   // const isEditing = props.id === editingNoteId;
//   const isEditing = useMemo(
//     () => props.id === editingNoteId,
//     [props.id, editingNoteId],
//   );
//   const note = useMemo(
//     () => notes.find((x) => x.id === props.id),
//     [notes, props.id],
//   );
//   const id = props.id;

//   const draggable = useDraggable({
//     id: typeof id === 'string' || typeof id === 'number' ? id : '',
//     disabled: editingNoteId === id,
//   });

//   const arrayOptions = {
//     moveFirst: () => {
//       setNotes((prevNotes) => {
//         const _notes = prevNotes.filter((x) => x.id !== id);
//         return [_notes[0], ..._notes];
//       });
//     },
//     moveLast: () => {
//       setNotes((prevNotes) => {
//         const _notes = prevNotes.filter((x) => x.id !== id);
//         return [..._notes, _notes[0]];
//       });
//     },
//     moveUp: () => {
//       setNotes((prevNotes) => {
//         const index = prevNotes.findIndex((x) => x.id === id);
//         if (index === 0) return prevNotes;
//         const _notes = [...prevNotes];
//         const temp = _notes[index];
//         _notes[index] = _notes[index - 1];
//         _notes[index - 1] = temp;
//         return _notes;
//       });
//     },
//     moveDown: () => {
//       setNotes((prevNotes) => {
//         const index = prevNotes.findIndex((x) => x.id === id);
//         if (index === prevNotes.length - 1) return prevNotes;
//         const _notes = [...prevNotes];
//         const temp = _notes[index];
//         _notes[index] = _notes[index + 1];
//         _notes[index + 1] = temp;
//         return _notes;
//       });
//     },
//     remove: () => {
//       setNotes((prevNotes) => {
//         return prevNotes.filter((x) => x.id !== id);
//       });
//     },
//     // update: (note: Note) => (note: Note) => {
//     //   setNotes((prevNotes) => {
//     //     return prevNotes.map((x) => {
//     //       if (x.id === note.id) {
//     //         return note;
//     //       }
//     //       return x;
//     //     });
//     //   });
//     // },
//     update: (fn: (note: Note, notes: Note[]) => Note) => {
//       setNotes((prevNotes) => {
//         return prevNotes.map((x) => {
//           if (x.id === id) {
//             return fn(x, prevNotes);
//           }
//           return x;
//         });
//       });
//     },
//   };
//   return {
//     notes,
//     setNotes,
//     setEditingNoteId,
//     editingNoteId,
//     isEditing,
//     note,
//     arrayOptions,
//     draggable,
//   };
// };
// export const useEditor = () => {
//   const { notes, setNotes, setEditingNoteId, editingNoteId } =
//     React.useContext(EditorContext);
//   return { notes, setNotes, setEditingNoteId, editingNoteId };
// };

const {
  context: EditorContext,
  useEditor,
  useNote,
} = createEditorContext<Note>();
export const Editor = () => {
  // const [notes, setNotes] = useState<Note[]>(notesData);
  // const EditorContext = createEditorContext<Note>();
  const sensors = useSensors(
    // useSensor(MouseSensor),
    useSensor(PointerSensor, {
      activationConstraint: { delay: 15, tolerance: 5 },
    }),
  );
  // const [editingNoteId, setEditingNoteId] = useState<Active['id'] | null>(null);
  const [editingNoteId, setEditingNoteId] = useQueryState(
    'editingNoteId',
    parseAsString,
  );
  const [grid, setGrid] = useQueryState('grid', parseAsFloat);
  const [notes, setNotes] = useQueryState(
    'notes',
    parseAsJson<Note[]>().withDefault(notesData),
  );
  const [showGrid, setShowGrid] = useState(false);
  function handleDragEnd(ev: DragEndEvent) {
    // What to do here??
    // It's not a sortable, it's a free drag and drop
    const over = ev.over;
    if (!over) return;
    const note = notes.find((x) => x.id === ev.active.id);
    if (!note) return;
    note.position.x += ev.delta.x;
    note.position.y += ev.delta.y;
    // snap to grid
    if (typeof grid === 'number') {
      note.position.x = Math.round(note.position.x / grid) * grid;
      note.position.y = Math.round(note.position.y / grid) * grid;
    }

    const _notes = notes.map((x) => {
      if (x.id === note.id) return note;
      return x;
    });
    setNotes(_notes);
  }

  return (
    <EditorContext.Provider
      value={{
        notes,
        setNotes,
        setEditingNoteId: setEditingNoteId as any,
        editingNoteId,
        grid: grid ?? 10,
        setGrid: setGrid as any,
        showGrid,
        setShowGrid,
      }}
    >
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <Droppable>
          {notes.map((note) => (
            <Draggable
              styles={{
                position: 'absolute',
                left: `${note.position.x}px`,
                top: `${note.position.y}px`,
              }}
              key={note.id}
              id={note.id}
            />
          ))}
        </Droppable>
      </DndContext>
      <EditorOptions />
    </EditorContext.Provider>
  );
};

export { useEditor };
export { useNote };
