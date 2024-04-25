import React from 'react';
import { Editor } from './components/editor';

const EditorPage = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>Editor</h1>
      <div className="p-4">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
