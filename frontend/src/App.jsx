import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Resources from "./pages/Resources";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai" element={<AIInsights />} />
      </Routes>
    </div>
  );
}

export default App;