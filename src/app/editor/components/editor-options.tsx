import { Button } from '@/components/ui/button';
import crypto from 'crypto';
import { Note, useEditor } from './editor';
import { ImageIcon, TextIcon, TrashIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
export const EditorOptions = () => {
  const {
    notes,
    setNotes,
    setEditingNoteId,
    editingNoteId,
    grid,
    setGrid,
    setShowGrid,
    showGrid,
  } = useEditor();
  return (
    <div>
      <Button
        variant={'default'}
        onClick={() => {
          setNotes([
            ...notes,
            {
              // id: `${notes.length + 1}`,
              id: crypto.randomBytes(16).toString('hex'),
              content: `Hello ${notes.length + 1}`,
              position: { x: 0, y: 0 },
              type: 'text',
            },
          ]);
        }}
      >
        <TextIcon />
      </Button>
      <Button
        variant={'default'}
        onClick={() => {
          setNotes([
            ...notes,
            {
              id: crypto.randomBytes(16).toString('hex'),
              image: 'https://source.unsplash.com/random',
              position: { x: 0, y: 0 },
              type: 'image',
              height: 100,
              width: 100,
            },
          ]);
        }}
      >
        <ImageIcon />
      </Button>
      <Button
        variant={'destructive'}
        onClick={() => {
          setNotes([]);
        }}
      >
        <TrashIcon />
      </Button>
      <div className="flex items-center">
        <Input
          type="range"
          min={10}
          max={62}
          // a4
          // step 62/297
          step={0.1}
          value={grid}
          onChange={(e) => setGrid(parseFloat(e.target.value))}
        />
        <span>{Math.round(grid * 1000) / 1000}</span>
        <div className="items-top flex space-x-2">
          <Checkbox
            id="showGrid"
            checked={showGrid}
            onCheckedChange={(e) => setShowGrid(e ? true : false)}
          />

          <label htmlFor="showGrid">Show Grid</label>
        </div>
      </div>
    </div>
  );
};
