import Webcam from "react-webcam";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Analyze() {
  const webcamRef = useRef(null);

  const [score, setScore] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();


  const captureAndAnalyze = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then(res => res.blob());

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData
      );

      setScore(res.data.score);
      setMessages(res.data.message);

    } catch (err) {
  console.error("API ERROR:", err.response?.data || err.message);
}
  };

  const downloadReport = async () => {
  if (!webcamRef.current) return;

  const imageSrc = webcamRef.current.getScreenshot();
  if (!imageSrc) return;

  const blob = await fetch(imageSrc).then(res => res.blob());

  const formData = new FormData();
  formData.append("file", blob, "frame.jpg");

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/generate-report",
      formData,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "Posture_Report.pdf");

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    console.error(err);
  }
};


const handleToggle = async () => {
  if (isRunning) {
    // STOP → save session
    try {
      await axios.post("http://127.0.0.1:8000/end-session");
    } catch (err) {
      console.error(err);
    }
  }

  setIsRunning(!isRunning);
};

  // 🔁 Real-time loop
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        captureAndAnalyze();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);
  // this is for stars
  useEffect(() => {
    const p = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      size: 2 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.5,
    }));
    setParticles(p);
  }, []);

  return (
    // <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#020617] text-white flex flex-col items-center pt-24 pb-10"> this is for stars
    <div className="min-h-screen relative overflow-hidden bg-[#020617] text-white flex flex-col items-center pt-24 pb-20">
    {/* BACKGROUND */}

    <div className="absolute inset-0 pointer-events-none">

      {/* grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg,#1f2937 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_60%)]" />

      {/* particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      ))}

    </div>  
{/* 
    stars end */}

    <div className="relative z-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">
        Live Posture Analysis
      </h1>

      {/* CAMERA */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg border border-gray-700 w-[500px]"
      />

      {/* BUTTON */}
      <div className="flex gap-4 mt-6">


  

  <button
    onClick={handleToggle}
    className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 shadow-md"
  >
    {isRunning ? "Stop Analysis" : "Start Analysis"}
  </button>

  <button
    onClick={downloadReport}
    className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 shadow-md"
  >
    Download Report
  </button>
  </div>
</div>

      {/* RESULTS */}
      {score !== null && (
        <div className="mt-6 text-center">

          <h2
            className={`text-3xl font-bold ${
              score > 80
                ? "text-green-400"
                : score > 60
                ? "text-yellow-400"
                : "text-red-500"
            }`}
          >
            Score: {score}
          </h2>

          <div className="mt-4">
            {messages.map((msg, index) => (
              <p key={index} className="text-lg text-red-400">
                {msg}
              </p>
            ))}
          </div>
                  <button
          onClick={() =>
            navigate("/ai", {
              state: {
                score: score,
                issues: messages,
              },
            })
          }
          className="mt-4 px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
        >
          Get AI Insights
        </button>

        </div>
      )}
    {/* this is for home dash */}
    <div className="mt-14 max-w-3xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center shadow-lg">

      <h2 className="text-3xl font-bold mb-4 text-purple-300">
        Your spine will thank you.
      </h2>

      <p className="text-gray-400 mb-6">
        View your posture history, track improvements, and monitor alignment in the dashboard.
      </p>

      <Link
        to="/dashboard"
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg hover:scale-105 transition"
      >
        View Dashboard
      </Link>

    </div>
    </div>
    
  );
}

export default Analyze;



