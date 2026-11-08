
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Process from "./pages/Process";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/process" element={<Process />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}