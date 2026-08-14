import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const LANGUAGES = {
  javascript: {
    name: "JavaScript",
    version: "18.15.0",
    defaultCode: `// Welcome to the Retro Editor!\nfunction greeting() {\n  console.log("Hello, World!");\n}\n\ngreeting();`
  },
  python: {
    name: "Python",
    version: "3.10.0",
    defaultCode: `# Welcome to the Retro Editor!\ndef greeting():\n    print("Hello, World!")\n\ngreeting()`
  },
  cpp: {
    name: "C++",
    version: "10.2.0",
    defaultCode: `// Welcome to the Retro Editor!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`
  },
  java: {
    name: "Java",
    version: "15.0.2",
    defaultCode: `// Welcome to the Retro Editor!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
  }
};

export const useEditorStore = create(
  persist(
    (set) => ({
      language: 'javascript',
      code: LANGUAGES['javascript'].defaultCode,
      stdin: '',
      
      setLanguage: (lang) => set({
        language: lang,
        code: LANGUAGES[lang].defaultCode,
      }),
      
      setCode: (newCode) => set({ code: newCode }),
      setStdin: (newStdin) => set({ stdin: newStdin }),
    }),
    {
      name: 'dsav_editor_storage',
    }
  )
);

export { LANGUAGES };
