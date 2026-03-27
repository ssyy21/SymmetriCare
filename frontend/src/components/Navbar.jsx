import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
function Navbar() {
  return (
    <div className="w-full bg-gray-800 text-white px-8 py-4 flex justify-between items-center shadow-md">

      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-xl">

        <img
          src={logo}
          alt="logo"
          className="w-9 h-9"
        />

        SymmetriCare

      </div>

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