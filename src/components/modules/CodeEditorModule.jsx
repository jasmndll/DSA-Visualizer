import Editor from "@monaco-editor/react";
import { useState } from "react";

const LANGUAGES = {
  javascript: {
    name: "JavaScript",
    version: "18.15.0",
    defaultCode: `// Welcome to the Retro Editor!
function greeting() {
  console.log("Hello, World!");
}

greeting();`
  },
  python: {
    name: "Python",
    version: "3.10.0",
    defaultCode: `# Welcome to the Retro Editor!
def greeting():
    print("Hello, World!")

greeting()`
  },
  cpp: {
    name: "C++",
    version: "10.2.0",
    defaultCode: `// Welcome to the Retro Editor!
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
  },
  java: {
    name: "Java",
    version: "15.0.2",
    defaultCode: `// Welcome to the Retro Editor!
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  }
};

export default function CodeEditorModule() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGES["javascript"].defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(LANGUAGES[newLang].defaultCode);
    setOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running on Wandbox API...");

    try {
      let compilerName = "nodejs-20.17.0";
      if (language === "python") compilerName = "cpython-3.14.0";
      if (language === "cpp") compilerName = "gcc-13.2.0";
      if (language === "java") compilerName = "openjdk-jdk-22+36";

      const payload = {
        code: code,
        compiler: compilerName,
        save: false
      };

      const response = await fetch("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      let finalOutput = "";
      
      // Compilation / compiler messages
      if (data.compiler_error) {
        finalOutput += "--- Compilation Error ---\n" + data.compiler_error + "\n";
      } else if (data.compiler_message) {
        // Only append if it's something meaningful, sometimes it's just warnings.
        // We'll append it just in case.
        // finalOutput += "Compiler message:\n" + data.compiler_message + "\n";
      }

      // Runtime errors
      if (data.program_error) {
        finalOutput += "--- Runtime Error ---\n" + data.program_error + "\n";
      }

      // Standard output
      if (data.program_output) {
        finalOutput += data.program_output;
      } else if (data.program_message && !data.program_error && !data.program_output) {
        finalOutput += data.program_message;
      }
      
      if (data.status !== "0" && data.status !== undefined) {
        finalOutput += `\n\n[Process exited with status ${data.status}]`;
      }

      setOutput(finalOutput || "Program finished with no output.");
    } catch (err) {
      setOutput("Error executing code:\n" + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full h-[500px]">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className="retro-btn font-display text-[10px] px-3 py-1 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? "⏳ Running..." : "▶ Run"}
        </button>
        
        <select 
          value={language}
          onChange={handleLanguageChange}
          className="font-body text-[11px] px-2 py-1 border-2 border-ink rounded-win bg-white outline-none cursor-pointer"
        >
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <option key={key} value={key}>{lang.name}</option>
          ))}
        </select>

        <span className="font-body text-xs text-ink/50 ml-auto">
          main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
        </span>
      </div>

      {/* Editor Space */}
      <div className="flex-grow border-2 border-ink rounded-win overflow-hidden h-2/3">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "Fira Code",
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Console Output */}
      <div className="h-1/3 bg-ink/95 border-2 border-ink rounded-win p-2 overflow-y-auto">
        <div className="font-display text-[10px] text-mint-200 mb-1 border-b border-mint-200/20 pb-1">CONSOLE OUTPUT</div>
        <pre className="font-body text-[11px] text-white/90 whitespace-pre-wrap">
          {output || "Waiting for execution..."}
        </pre>
      </div>
    </div>
  );
}
