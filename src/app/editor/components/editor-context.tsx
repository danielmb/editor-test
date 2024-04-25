import { Active, UseDraggableArguments, useDraggable } from '@dnd-kit/core';
import React from 'react';
interface Position {
  x: number;
  y: number;
}
interface BaseNote {
  id: string;
  position: Position;
}
interface EditorContextProps<T extends BaseNote> {
  notes: T[];
  setNotes: React.Dispatch<React.SetStateAction<T[]>>;
  setEditingNoteId: React.Dispatch<React.SetStateAction<Active['id'] | null>>;
  setGrid: React.Dispatch<React.SetStateAction<number>>;
  editingNoteId: Active['id'] | null;
  grid: number;
  showGrid: boolean;
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>;
}
interface UseNoteProps<T extends BaseNote> {
  id: Active['id'] | null;
  draggableOptions?: UseDraggableArguments;
}

export const createUseEditor = <T extends BaseNote>(
  context: React.Context<EditorContextProps<T>>,
) => {
  const useEditor = () => {
    return React.useContext(context);
  };

  return {
    useEditor,
  };
};

export const createUseNote = <T extends BaseNote>(
  context: React.Context<EditorContextProps<T>>,
) => {
  const useNote = (props: UseNoteProps<T>) => {
    const { notes, setNotes, editingNoteId, ...rest } =
      React.useContext(context);
    // const draggable = useDraggable({
    //   id: props.id || '',
    //   disabled: editingNoteId === props.id,
    //   ...props.draggableOptions,
    // });
    const arrayOptions = useArrayOptions<T>(notes, setNotes, props.id || '');
    const note = notes.find((note) => note.id === props.id);
    return {
      note,
      notes,
      setNotes,
      editingNoteId,
      isEditing: editingNoteId === props.id,
      arrayOptions,
      ...rest,
    };
  };

  return {
    useNote,
  };
};

export const createEditorContext = <T extends BaseNote>() => {
  const context = React.createContext<EditorContextProps<T>>({
    notes: [],
    setNotes: () => {},
    setEditingNoteId: () => {},
    editingNoteId: null,
    grid: 10,
    setGrid: () => {},
    setShowGrid: () => {},
    showGrid: false,
  });
  return {
    context,
    useEditor: createUseEditor(context).useEditor,
    useNote: createUseNote(context).useNote,
  };
};

// export const useEditor = <T extends BaseNote>() =>
//   React.useContext(createEditorContext<T>());

export const useArrayOptions = <T extends BaseNote>(
  notes: T[],
  setNotes: React.Dispatch<React.SetStateAction<T[]>>,
  currentId: Active['id'],
) => {
  const moveFirst = (id: Active['id'] = currentId) => {
    setNotes((notes) => {
      const index = notes.findIndex((note) => note.id === id);
      const [movedNote] = notes.splice(index, 1);
      return [movedNote, ...notes];
    });
  };

  const moveLast = (id: Active['id'] = currentId) => {
    setNotes((notes) => {
      const index = notes.findIndex((note) => note.id === id);
      const [movedNote] = notes.splice(index, 1);
      return [...notes, movedNote];
    });
  };

  const moveUp = (id: Active['id'] = currentId) => {
    setNotes((notes) => {
      const index = notes.findIndex((note) => note.id === id);
      if (index === 0) return notes;
      const [movedNote] = notes.splice(index, 1);
      return [
        ...notes.slice(0, index - 1),
        movedNote,
        notes[index - 1],
        ...notes.slice(index),
      ];
    });
  };

  const moveDown = (id: Active['id'] = currentId) => {
    setNotes((notes) => {
      const index = notes.findIndex((note) => note.id === id);
      if (index === notes.length - 1) return notes;
      const [movedNote] = notes.splice(index, 1);
      return [
        ...notes.slice(0, index),
        notes[index + 1],
        movedNote,
        ...notes.slice(index + 1),
      ];
    });
  };

  const remove = (id: Active['id'] = currentId) => {
    setNotes((notes) => notes.filter((note) => note.id !== id));
  };

  const update = (id: Active['id'], updater: (note: T) => T) => {
    setNotes((notes) =>
      notes.map((note) => (note.id === id ? updater(note) : note)),
    );
  };

  return {
    moveFirst,
    moveLast,
    moveUp,
    moveDown,
    remove,
    update,
  };
};
