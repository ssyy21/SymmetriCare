import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function AIInsights() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const location = useLocation();
  const { score, issues } = location.state || {};

  // 🔥 AUTO AI ANALYSIS (when coming from Analyze page)
  useEffect(() => {
    const fetchAI = async () => {
      if (!score || !issues) return;

      try {
        setLoading(true);

        const res = await axios.post("http://127.0.0.1:8000/ai-analysis", {
          score,
          issues,
        });

        setMessages([
          {
            role: "assistant",
            content: res.data.analysis,
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [score, issues]);





const formatAIResponse = (text) => {
  const sections = {
    summary: "",
    issues: "",
    risks: "",
    exercises: "",
    tips: "",
  };

  const lines = text.split("\n");

  let current = "summary";

  lines.forEach((line) => {
    const lower = line.toLowerCase();

    if (lower.includes("issue") || lower.includes("problem")) current = "issues";
    else if (lower.includes("risk") || lower.includes("pain")) current = "risks";
    else if (lower.includes("exercise") || lower.includes("stretch")) current = "exercises";
    else if (lower.includes("tip") || lower.includes("habit")) current = "tips";

    sections[current] += line + "\n";
  });

  return sections;
};





  // 🔥 CHAT INPUT FUNCTION
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/ai-analysis", {
        score: score || 95,
        issues: [input],
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.analysis,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 PDF UPLOAD FUNCTION (THIS WAS MISSING ❗)
  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/ai-report-analysis",
        formData
      );

      setMessages([
        {
          role: "assistant",
          content: res.data.analysis,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-700 text-xl font-semibold">
        AI Posture Advisor
      </div>

      {/* 📄 PDF Upload Section */}
      <div className="p-4 border-b border-gray-700 flex gap-4 items-center">

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />

        <button
          onClick={handleFileUpload}
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
        >
          Upload & Analyze Report
        </button>

      </div>



      

      {/* Chat Area */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">

  {messages.map((msg, index) => {

    // 👤 USER MESSAGE
    if (msg.role === "user") {
      return (
        <div
          key={index}
          className="bg-blue-500 ml-auto p-3 rounded-lg max-w-[70%]"
        >
          {msg.content}
        </div>
      );
    }

    // 🤖 AI MESSAGE → CARD UI
    const sections = formatAIResponse(msg.content);

    return (
      <div key={index} className="w-full space-y-4">

{/* SUMMARY */}
{sections.summary && (
  <div className="bg-gray-800 p-4 rounded-xl shadow">
    <h2 className="text-lg font-semibold text-blue-400 mb-2">
      Summary
    </h2>
    <div className="text-gray-300 whitespace-pre-line">
      <ReactMarkdown>
        {sections.summary}
      </ReactMarkdown>
    </div>
  </div>
)}

{/* ISSUES */}
{sections.issues && (
  <div className="bg-red-500/10 border border-red-400 p-4 rounded-xl">
    <h2 className="text-lg font-semibold text-red-400 mb-2">
      Issues
    </h2>
    <div className="text-gray-300 whitespace-pre-line">
      <ReactMarkdown>
        {sections.issues}
      </ReactMarkdown>
    </div>
  </div>
)}

{/* RISKS */}
{sections.risks && (
  <div className="bg-yellow-500/10 border border-yellow-400 p-4 rounded-xl">
    <h2 className="text-lg font-semibold text-yellow-400 mb-2">
      Risks
    </h2>
    <div className="text-gray-300 whitespace-pre-line">
      <ReactMarkdown>
        {sections.risks}
      </ReactMarkdown>
    </div>
  </div>
)}

{/* EXERCISES */}
{sections.exercises && (
  <div className="bg-green-500/10 border border-green-400 p-4 rounded-xl">
    <h2 className="text-lg font-semibold text-green-400 mb-2">
      Exercises
    </h2>
    <div className="text-gray-300 whitespace-pre-line">
      <ReactMarkdown>
        {sections.exercises}
      </ReactMarkdown>
    </div>
  </div>
)}

{/* TIPS */}
{sections.tips && (
  <div className="bg-purple-500/10 border border-purple-400 p-4 rounded-xl">
    <h2 className="text-lg font-semibold text-purple-400 mb-2">
      Daily Tips
    </h2>
    <div className="text-gray-300 whitespace-pre-line">
      <ReactMarkdown>
        {sections.tips}
      </ReactMarkdown>
    </div>
  </div>
)}

      </div>
    );
  })}

  {loading && (
    <p className="text-gray-400 animate-pulse">
      AI is thinking...
    </p>
  )}

</div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          placeholder="Ask about your posture..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-4 bg-purple-500 rounded hover:bg-purple-600"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default AIInsights;