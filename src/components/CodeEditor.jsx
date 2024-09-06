import { useRef, useState } from "react";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Button, Grid } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import DebugConsole from "./DebugConsole";
import Debugger from "./Debugger";
import {
  saveCodeSnippets,
  getAllCodeSnippets,
  deleteCodeSnippet,
} from "../apiBackend";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [breakpoints, setBreakpoints] = useState([]);
  const [logs, setLogs] = useState([]);
  const [allCodeSnippets, setAllCodeSnippets] = useState([]);
  const [showCodeSnippets, setShowCodeSnippets] = useState([false]);
  const [showDebuggingConsole, setShowDebuggingConsole] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const handleAddBreakpoint = () => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      const model = editorRef.current.getModel();
      const id = model.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(
              position.lineNumber,
              1,
              position.lineNumber,
              1
            ),
            options: {
              isWholeLine: true,
              className: "myContentClass",
              glyphMarginClassName: "myGlyphMarginClass",
            },
          },
        ]
      );

      setBreakpoints((prevBreakpoints) => {
        const newBreakpoints = new Map(
          prevBreakpoints.map((line) => [line, null])
        );
        newBreakpoints.set(position.lineNumber, id[0]);
        return Array.from(newBreakpoints.keys());
      });
      setLogs((prevLogs) => [
        ...prevLogs,
        `Breakpoint added at line ${position.lineNumber}`,
      ]);
    }
  };

  const handleRemoveBreakpoint = () => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      setBreakpoints((prevBreakpoints) => {
        const newBreakpoints = new Map(
          prevBreakpoints.map((line) => [line, null])
        );

        if (newBreakpoints.has(position.lineNumber)) {
          const id = newBreakpoints.get(position.lineNumber);
          editorRef.current.getModel().deltaDecorations([id], []);
          newBreakpoints.delete(position.lineNumber);
        }
        return Array.from(newBreakpoints.keys());
      });
      setLogs((prevLogs) => [
        ...prevLogs,
        `Breakpoint removed at line ${position.lineNumber}`,
      ]);
    }
  };

  const handleSaveCode = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      try {
        const response = await saveCodeSnippets({
          code: code,
          language: language,
        });

        if (response.status === 201) {
          alert("Code saved successfully!");
        } else {
          alert("Failed to save code.");
        }
      } catch (error) {
        if (error.response) {
          console.error("Error saving code:", error.response.data);
        } else {
          console.error("Error saving code:", error.message);
        }
        alert("Error saving code.");
      }
    }
  };

  const handleRetrieveCodeSnippets = async () => {
    try {
      const response = await getAllCodeSnippets();
      setAllCodeSnippets(response.data);
      setShowCodeSnippets(true);
      setShowDebuggingConsole(false);
    } catch (error) {
      console.log("Error retrieving code snippets:", error);
    }
  };

  const handleDeleteCodeSnippet = async (id) => {
    try {
      const response = await deleteCodeSnippet(id);
      if (response.status === 200) {
        alert("Code snippet deleted successfully!");
        setAllCodeSnippets((prevSnippets) =>
          prevSnippets.filter((snippet) => snippet.id !== id)
        );
      } else {
        alert("Failed to delete code snippet.");
      }
    } catch (error) {
      console.error("Error deleting code snippet:", error);
      alert("Error deleting code snippet.");
    }
  };

  const handleBackToOutput = () => {
    setShowCodeSnippets(false);
    setShowDebuggingConsole(false);
  };

  const handleShowDebuggingConsole = () => {
    setShowDebuggingConsole(true);
    setShowCodeSnippets(false);
  };

  return (
    <Box>
      <Box>
        <Button onClick={handleAddBreakpoint} style={{ marginRight: "10px" }}>
          Add Breakpoint
        </Button>
        <Button
          onClick={handleRemoveBreakpoint}
          style={{ marginRight: "10px" }}
        >
          Remove Breakpoint
        </Button>
        <Button
          onClick={handleShowDebuggingConsole}
          style={{ marginRight: "10px" }}
        >
          Debug
        </Button>
        <Button onClick={handleSaveCode} style={{ marginRight: "10px" }}>
          Save Code
        </Button>
        <Button
          onClick={handleRetrieveCodeSnippets}
          style={{ marginRight: "10px" }}
        >
          Saved Codes
        </Button>
        <Button onClick={handleBackToOutput}>Output</Button>
      </Box>
      <br />
      <HStack spacing={4}>
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Box
            border="5px solid"
            borderColor="purple.500"
            borderRadius="md"
            overflow="hidden"
          >
            <Editor
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              height="75vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
            <Debugger
              editor={editorRef.current}
              setBreakpoints={setBreakpoints}
              setLogs={setLogs}
            />
          </Box>
        </Box>
        {showDebuggingConsole ? (
          <DebugConsole logs={logs} />
        ) : showCodeSnippets ? (
          <Box
            w="50%"
            overflow="scroll"
            maxHeight="76vh"
            border="1px solid gray"
            marginTop="86px"
          >
            <VStack spacing={4} align="left">
              {allCodeSnippets.map((snippet, index) => (
                <Box key={index} p={4} bg="gray-700" borderRadius="md">
                  <Text fontWeight="bold"> Language : {snippet.language}</Text>
                  <Text>{snippet.code}</Text>
                  <Text fontSize="sm" color="gray-400">
                    Created At : {new Date(snippet.createdAt).toLocaleString()}
                  </Text>
                  <Button
                    onClick={() => handleDeleteCodeSnippet(snippet._id)}
                    style={{ margin: "10px" }}
                  >
                    Delete
                  </Button>
                  <Button style={{ margin: "10px" }}>Update</Button>
                </Box>
              ))}
            </VStack>
          </Box>
        ) : (
          <Output
            editorRef={editorRef}
            language={language}
            breakpoints={breakpoints}
          />
        )}
      </HStack>
    </Box>
  );
};

export default CodeEditor;
