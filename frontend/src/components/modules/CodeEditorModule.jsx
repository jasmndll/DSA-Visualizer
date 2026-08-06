import Editor from "@monaco-editor/react";
import { useState } from "react";
import apiClient from "../../api/client";

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
  const [stdin, setStdin] = useState("");
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
    setOutput("Running...");

    try {
      const { data } = await apiClient.post("/execute", {
        language,
        code,
        stdin,
      });

      if (data.stderr) {
        setOutput(data.stdout
          ? data.stdout + "\n--- stderr ---\n" + data.stderr
          : data.stderr);
      } else {
        setOutput(data.stdout || "Program finished with no output.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setOutput("Error executing code:\n" + msg);
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

      {/* Bottom Panel: Input & Console */}
      <div className="flex gap-2 h-1/3">
        {/* Input (stdin) */}
        <div className="flex flex-col w-1/3 bg-white border-2 border-ink rounded-win p-2">
          <div className="font-display text-[10px] text-ink mb-1 border-b border-ink/20 pb-1">INPUT (STDIN)</div>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter program input here, one line per prompt..."
            className="flex-grow font-body text-[11px] outline-none resize-none bg-transparent"
          />
        </div>

        {/* Console Output */}
        <div className="flex flex-col w-2/3 bg-ink/95 border-2 border-ink rounded-win p-2 overflow-y-auto">
          <div className="font-display text-[10px] text-mint-200 mb-1 border-b border-mint-200/20 pb-1">CONSOLE OUTPUT</div>
          <pre className={`font-body text-[11px] whitespace-pre-wrap ${
            output.includes("--- stderr ---") || output.startsWith("Error executing code:")
              ? "text-red-400"
              : "text-white/90"
          }`}>
            {output || "Waiting for execution..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
