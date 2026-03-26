import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Activity,
  Target,
  Clock,
  AlertCircle,
  Award,
  Calendar,
} from "lucide-react";

// 🔥 MOCK DATA (fallback)
const generateMockData = () => {
  const now = new Date();
  const data = [];

  for (let i = 20; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 3600000);
    data.push({
      name: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      score: Math.floor(Math.random() * 10) + 90,
      date: date.toLocaleDateString(),
    });
  }
  return data;
};

const generateMonthlyData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
      score: Math.floor(Math.random() * 8) + 92,
    });
  }
  return data;
};

function Dashboard() {
const [data, setData] = useState([]);
const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    best: 0,
    improvement: 0,
    common_issue: "Loading...",
    totalScans: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 TRY REAL BACKEND
        const historyRes = await axios.get("http://127.0.0.1:8000/history");
        const analyticsRes = await axios.get("http://127.0.0.1:8000/analytics");

        const formatted = historyRes.data.map((item) => ({
          name: new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          score: item.score,
          date: new Date(item.timestamp).toLocaleDateString(),
        }));

        setData(formatted);

        // Group for monthly
        const grouped = {};
        historyRes.data.forEach((item) => {
          const date = new Date(item.timestamp).toLocaleDateString();
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(item.score);
        });

        const monthlyFormatted = Object.keys(grouped).map((date) => {
          const scores = grouped[date];
          const avg =
            scores.reduce((a, b) => a + b, 0) / scores.length;
          return { date, score: avg };
        });

        setMonthlyData(monthlyFormatted);

        setStats({
          ...analyticsRes.data,
          totalScans: historyRes.data.length,
        });

      } catch (err) {
        console.log("⚠️ Using mock data");

        // 🔥 FALLBACK DATA
        setData(generateMockData());
        setMonthlyData(generateMonthlyData());

        setStats({
          average: 94,
          best: 98,
          improvement: 5,
          common_issue: "Forward Neck",
          totalScans: 120,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-4">
          <Activity className="w-10 h-10" />
          <div>
            <h1 className="text-4xl font-bold">Posture Dashboard</h1>
            <p className="text-blue-100">Track your posture improvement</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <StatCard title="Average" value={stats.average} icon={<Target />} color="blue" />
          <StatCard title="Best" value={stats.best} icon={<Award />} color="green" />
          <StatCard title="Improvement" value={`${stats.improvement}%`} icon={<TrendingUp />} color="purple" />
          <StatCard title="Scans" value={stats.totalScans} icon={<Clock />} color="orange" />

        </div>

        {/* INSIGHT */}
        <div className="bg-yellow-500/10 border border-yellow-400 p-5 rounded-xl mb-8 flex gap-3">
          <AlertCircle className="text-yellow-400" />
          <p>
            <b>Most Common Issue:</b> {stats.common_issue}
          </p>
        </div>

        {/* REAL TIME CHART */}
        <div className="bg-white/5 p-6 rounded-2xl mb-8">
          <h2 className="mb-4 text-lg font-semibold">Real-time Tracking</h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#00ff99"
                fill="#00ff9940"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* MONTHLY */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="mb-4 text-lg font-semibold">Monthly Progress</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ffcc00"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// 🔥 STAT CARD COMPONENT
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-${color}-500/20 p-5 rounded-xl shadow-lg`}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-300">{title}</p>
        {icon}
      </div>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

export default Dashboard;