// App.tsx
import LeetCodeCompanyProblems from "./component/LeetCodeCompanyProblems";
import { BrowserRouter, Route, Routes } from "react-router";
import HomeScreen from "./component/HomeScreen";
import NotesTaken from "./component/NoteTaken";
import About from "./component/About";

function App() {
  return (
    <div className="w-[100vw] mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/:company" element={<LeetCodeCompanyProblems />} />
          <Route path="/notes" element={<NotesTaken />} />
          <Route path="/notes/:company" element={<NotesTaken />} />
          <Route path="/about" element={<About />} /> {/* Add this route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;