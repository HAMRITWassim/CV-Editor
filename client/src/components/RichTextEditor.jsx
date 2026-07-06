import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function RichTextEditor({ value, onChange }) {

  //STATES
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);



  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '<p>Décrivez vos missions...</p>',
    editorProps: {
      attributes: {
        class: 'p-2 min-h-[120px] outline-none [&_ul]:list-disc [&_ul]:ml-4',
      },
    },
    onTransaction: ({ editor }) => {
      setIsBold(editor.isActive('bold'));
      setIsItalic(editor.isActive('italic'));
      setIsList(editor.isActive('bulletList'));
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
    
  });

  if (!editor) {
    return null
    
  }


  return (
    <div className="flex flex-col rounded-md overflow-hidden bg-[#ffcd86] text-[#311603] focus-within:ring-2 focus-within:ring-[#fccc69] transition-all">
      
      <div className="flex gap-1 p-1 bg-[#fccc69] border-b border-[#61310e]/20">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-bold cursor-pointer ${editor.isActive('bold') ? 'bg-[#61310e] text-[#fccc69]' : 'hover:bg-[#e6b85c]'}`}
        >
          Gras
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm italic cursor-pointer ${editor.isActive('italic') ? 'bg-[#61310e] text-[#fccc69]' : 'hover:bg-[#e6b85c]'}`}
        >
          Italique
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm cursor-pointer ${editor.isActive('bulletList') ? 'bg-[#61310e] text-[#fccc69]' : 'hover:bg-[#e6b85c]'}`}
        >
          • Liste
        </button>
      </div>

      <EditorContent className="cursor-text bg-white" editor={editor} />
      
    </div>
  )
}