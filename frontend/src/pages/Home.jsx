import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">

      <h1 className="text-5xl font-bold mb-4">SymmetriCare</h1>

      <p className="text-xl text-gray-400 mb-6 text-center max-w-xl">
        Detect posture imbalance early and prevent long-term health issues using AI-powered real-time analysis.
      </p>

      <Link to="/analyze">
        <button className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600">
          Start Analysis
        </button>
      </Link>

    </div>
  );
}

export default Home;