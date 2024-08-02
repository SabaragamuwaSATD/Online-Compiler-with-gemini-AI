import { Box } from "@chakra-ui/react";
import CodeEditor from "./components/CodeEditor";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Box minH="100vh" bg="#2d1f41" color="white" px={6} py={8}>
      <Header />
      <br></br>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/codeEditor" element={<CodeEditor />} />
      </Routes>
      <br></br>
      <Footer />
    </Box>
  );
}

export default App;
