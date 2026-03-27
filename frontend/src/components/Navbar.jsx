import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-full bg-gray-800 text-white px-8 py-4 flex justify-between items-center shadow-md">

      {/* Logo */}
      <h1 className="text-xl font-bold">SymmetriCare</h1>

      {/* Links */}
      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/analyze" className="hover:text-blue-400">Analyze</Link>
        <Link to="/resources" className="hover:text-blue-400">Resources</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/ai">AI Advisor</Link>
      </div>

    </div>
  );
}

export default Navbar;