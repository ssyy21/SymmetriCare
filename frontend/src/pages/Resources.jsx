import { useState, useEffect } from "react";
import { Search, Activity, Book, Heart, Dumbbell } from "lucide-react";
import { Sparkles } from "lucide-react";
import { ResourceCard } from "../components/ResourceCard";
import { ResourceModal } from "../components/ResourceModal";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [status, setStatus] = useState("Good Posture");
  const [color, setColor] = useState("green");
  const [score, setScore] = useState(70);
  const [suggestion, setSuggestion] = useState("Keep it up 💪");
  const [time, setTime] = useState(0);
  const [modalResource, setModalResource] = useState(null);
const resources =  [
  {
    id: "1",
    title: "Correct Sitting Posture",
    description:
      "Keep your back straight, shoulders relaxed, and feet flat on the floor.",
    category: "Sitting",
    level: "Beginner",
    duration: "Daily Habit",
    image:
      "https://images.unsplash.com/photo-1696453423500-98461c31ed64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JyZWN0JTIwc2l0dGluZyUyMHBvc3R1cmUlMjBkZXNrfGVufDF8fHx8MTc3NDU0NjkxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    details: [
      "Sit with hips fully back in chair",
      "Keep knees at 90°",
      "Avoid slouching",
    ],
    keywords: ["sitting", "posture", "desk", "work"],
  },
  {
    id: "2",
    title: "Laptop Setup Guide",
    description:
      "Adjust your screen height to avoid neck strain and improve posture.",
    category: "Sitting",
    level: "Setup",
    duration: "5 min",
    image:
      "https://images.unsplash.com/photo-1760604359590-0f0dc7dbbf3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBlcmdvbm9taWMlMjBzZXR1cHxlbnwxfHx8fDE3NzQ1NDY5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    details: [
      "Screen at eye level",
      "Use external keyboard",
      "Avoid bending neck",
    ],
    keywords: ["laptop", "setup", "ergonomic", "screen"],
  },
  {
    id: "3",
    title: "Standing Posture",
    description:
      "Maintain a neutral spine and distribute weight evenly on both feet.",
    category: "Standing",
    level: "Beginner",
    duration: "Daily",
    image:
      "https://images.unsplash.com/photo-1739142258199-f75856a4e007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGluZyUyMHBvc3R1cmUlMjBwZXJzb258ZW58MXx8fHwxNzc0NTQ2OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    details: [
      "Keep shoulders back",
      "Distribute weight evenly",
      "Maintain neutral spine",
    ],
    keywords: ["standing", "posture", "balance"],
  },
  {
    id: "4",
    title: "Neck Stretch",
    description: "Relieve tension by gently tilting your head side to side.",
    category: "Exercises",
    level: "Easy",
    duration: "2 min",
    image:
      "https://images.unsplash.com/photo-1758599879824-70312ad2da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWNrJTIwc3RyZXRjaCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NDU0NjkxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    details: ["Tilt head left → hold 10 sec", "Tilt right → repeat"],
    keywords: ["neck", "stretch", "exercise", "tension"],
  },
  {
    id: "5",
    title: "Shoulder Rolls",
    description: "Reduce stiffness and improve shoulder mobility.",
    category: "Exercises",
    level: "Easy",
    duration: "3 min",
    image:
      "https://images.unsplash.com/photo-1686791789070-90949cfec4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG91bGRlciUyMG1vYmlsaXR5JTIwZXhlcmNpc2V8ZW58MXx8fHwxNzc0NDgzMDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    details: [
      "Roll shoulders backward 10 times",
      "Roll shoulders forward 10 times",
      "Repeat 2-3 sets",
    ],
    keywords: ["shoulder", "mobility", "exercise", "stiffness"],
  },
  {
    id: "6",
    title: "Back Stretch",
    description: "Stretch your spine to reduce lower back pain.",
    category: "Exercises",
    level: "Medium",
    duration: "5 min",
    image:
      "https://images.unsplash.com/photo-1758599881262-7b79a56ac284?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwYmFjayUyMHN0cmV0Y2h8ZW58MXx8fHwxNzc0NTQ2OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    details: [
      "Lie on back, knees to chest",
      "Hold for 30 seconds",
      "Repeat 3 times",
    ],
    keywords: ["back", "stretch", "pain", "relief"],
  },
  {
    id: "7",
    title: "Effects of Bad Posture",
    description: "Understand the negative impacts of poor posture on health.",
    category: "Health",
    level: "Info",
    duration: "3 min read",
    image:
      "https://images.unsplash.com/photo-1610033955190-7a051f350c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWQlMjBwb3N0dXJlJTIwZWZmZWN0cyUyMGhlYWx0aHxlbnwxfHx8fDE3NzQ1NDY5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    details: ["Back pain", "Neck strain", "Reduced breathing"],
    keywords: ["health", "effects", "bad posture"],
  },
  {
    id: "8",
    title: "Benefits of Good Posture",
    description: "Learn how proper posture enhances your overall well-being.",
    category: "Health",
    level: "Info",
    duration: "3 min read",
    image:
      "https://images.unsplash.com/photo-1597586309258-6c19d5acaa1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29kJTIwcG9zdHVyZSUyMGNvbmZpZGVuY2V8ZW58MXx8fHwxNzc0NTQ2OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    details: ["Better focus", "Less fatigue", "Improved confidence"],
    keywords: ["health", "benefits", "good posture"],
  },
];
  // ⏱️ Timer
  useEffect(() => {
    const interval = setInterval(() => setTime((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // 🤖 AI logic
  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.random();
      if (r < 0.3) {
        setStatus("⚠️ Neck Forward");
        setColor("red");
        setSuggestion("Raise your screen to eye level");
        setScore((s) => Math.max(s - 2, 40));
      } else if (r < 0.6) {
        setStatus("⚠️ Leaning");
        setColor("yellow");
        setSuggestion("Align shoulders properly");
      } else {
        setStatus("✅ Good Posture");
        setColor("green");
        setSuggestion("Great posture! Keep it up 💪");
        setScore((s) => Math.min(s + 1, 100));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const quickTips = [
    "Keep your screen at eye level",
    "Take a break every 30 minutes",
    "Keep shoulders relaxed",
    "Avoid crossing legs",
  ];

  const categories = [
    { id: "All", label: "All", icon: Activity },
    { id: "Sitting", label: "Sitting", icon: Book },
    { id: "Standing", label: "Standing", icon: Activity },
    { id: "Exercises", label: "Exercises", icon: Dumbbell },
    { id: "Health", label: "Health", icon: Heart },
  ];

  const cards = [
    { title: "Good Posture", desc: "Improves breathing", category: "Health", img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e" },
    { title: "Avoid Slouching", desc: "Protect spine", category: "Health", img: "https://images.unsplash.com/photo-1584467735871-8c2c6c41f2e6" },
    { title: "Sit Properly", desc: "Eye-level screen", category: "Sitting", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b" },
    { title: "Stretch Daily", desc: "Reduce stiffness", category: "Exercises", img: "https://images.unsplash.com/photo-1518611012118-f3c5c5c7c4f1" },
    { title: "Stand Right", desc: "Balance body", category: "Standing", img: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74" },
    { title: "Desk Setup", desc: "Fix workspace", category: "Sitting", img: "https://images.unsplash.com/photo-1581090700227-4c4b4c6c4c4c" },
  ];

  const filteredCards = cards.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 text-center">
         <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
              Improve Your Posture, Improve Your Life
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Personalized tips, exercises, and guides based on your posture
            </p>
            <p className="text-sm text-blue-200 mt-2 italic">
              Resources are personalized based on your posture analysis
            </p>

        <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              />
            </div>
          </div>

        {/* FILTERS */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === c.id
                  ? "bg-white text-blue-600 scale-105"
                  : "bg-white/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* AI Recommendation Section */}
        <div className="mb-12">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-600" />
              <h2 className="text-3xl">Recommended for You</h2>
            </div>
            <p className="text-white-700 mb-6 text-lg">
              We detected forward neck posture. Try these:
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-10 text-white-">
  {resources.map((item) => (
    <ResourceCard
      key={item.id}
      {...item}
      onLearnMore={() => setModalResource(item)}
    />
  ))}
</div>
<ResourceModal
  isOpen={!!modalResource}
  onClose={() => setModalResource(null)}
  {...(modalResource || {})}
/>
          </div>
        </div>

        {/* 🔥 AI FEEDBACK */}
        <div className={`p-6 rounded-xl mb-8 text-center font-semibold transition ${
          color === "green"
            ? "bg-green-200"
            : color === "yellow"
            ? "bg-yellow-200"
            : "bg-red-200"
        }`}>
          {status}
          <p className="mt-2 text-sm">💡 {suggestion}</p>
        </div>

        {/* 🧠 ABOUT */}
        {/* <div className="bg-white p-6 rounded-xl shadow mb-8 hover:shadow-lg transition">
          <h2 className="text-xl mb-2">🧠 About SymmetriCare</h2>
          <p className="text-gray-600 text-sm">
            AI-powered posture monitoring system with real-time feedback and smart recommendations.
          </p>
        </div> */}

        {/* 💡 QUICK TIPS */}
        <div className="mb-12">
        <h2 className="text-3xl mb-6">Quick Tips</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          
          {quickTips.map((tip, i) => (
            <div key={i} className="bg-red p-4 rounded-xl shadow text-center hover:scale-105 transition">
              💡 {tip}
            </div>
          ))}
        </div>
        </div>

        {/* 🔥 CARDS */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-10">
          {filteredCards.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
              <img src={item.img} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* 📊 SCORE */}
        {/* <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="mb-2">Posture Score: {score}</h2>
          <div className="bg-gray-200 h-3 rounded">
            <div
              className="bg-green-500 h-3 rounded transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-sm mt-2">Time: {time} min</p>
        </div> */}

        {/* 🎥 VIDEOS */}
        <div>
          <h2 className="text-xl mb-4">🎬 Videos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["2xSlX7n-IHw", "LT_dFRnmdGs"].map((id) => (
              <iframe
                key={id}
                src={`https://www.youtube.com/embed/${id}`}
                className="w-full h-48 rounded-xl shadow"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}