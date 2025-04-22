import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import { debounce } from 'lodash';

const Editor = ({ socketRef, roomId, onCodeChange, code }) => {
  const editorRef = useRef(null);

  // Ref for debounced emit function
  const emitCodeChange = useRef(
    debounce((code) => {
      if (socketRef.current) {
        socketRef.current.emit('code-change', { roomId, code });
      }
    }, 300) // 300ms delay for smoother typing
  ).current;

  useEffect(() => {
    const textarea = document.getElementById('realtimeEditor');
    if (!textarea) return;

    const editor = Codemirror.fromTextArea(textarea, {
      mode: { name: 'javascript', json: true },
      theme: 'dracula',
      autoCloseBrackets: true,
      matchBrackets: true,
      lineNumbers: true,
    });

    editorRef.current = editor;

    // Listen to editor changes and use debounced emit
    editor.on('change', (instance) => {
      const code = instance.getValue();
      onCodeChange(code); // Passing updated code to parent
      emitCodeChange(code); // Emit with debounce
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null; // Cleanup ref
      }
    };
    
  }, [onCodeChange, roomId, socketRef]);

  // Update the editor content when `code` prop changes
  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleCodeChange = ({ code }) => {
      if (code !== null && editorRef.current) {
        const currentCode = editorRef.current.getValue();
        if (currentCode !== code) {
          editorRef.current.setValue(code);
        }
      }
    };

    socket.on('code-change', handleCodeChange);

    return () => {
      socket.off('code-change', handleCodeChange);
    };
  }, [socketRef]);

  return <textarea id="realtimeEditor" />;
};

export default Editor;