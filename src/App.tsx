import LeetCodeCompanyProblems from "./component/LeetCodeCompanyProblems";
import { BrowserRouter, Route, Routes } from "react-router";
import HomeScreen from "./component/HomeScreen";

function App() {
  return (
    <div className="w-[100vw] mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/:company" element={<LeetCodeCompanyProblems />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
