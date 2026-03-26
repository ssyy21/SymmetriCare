import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]); // ✅ FIXED
  const [stats, setStats] = useState(null);

  useEffect(() => {

    
    const fetchData = async () => {
      try {

        // 1️⃣ Fetch history
        const historyRes = await axios.get("http://127.0.0.1:8000/history");

        // ✅ FIRST CHART (raw scan data)
        const formatted = historyRes.data.map((item, index) => ({
          name: new Date(item.timestamp).toLocaleTimeString(),
          score: item.score,
          date: new Date(item.timestamp).toLocaleDateString(),
        }));

        setData(formatted);

        // 🔥 SECOND CHART (grouped monthly/daily data)
        const grouped = {};

        historyRes.data.forEach((item) => {
          const date = new Date(item.timestamp).toLocaleDateString();

          if (!grouped[date]) {
            grouped[date] = [];
          }

          grouped[date].push(Number(item.score));
        });

        const monthlyFormatted = Object.keys(grouped).map((date) => {
          const scores = grouped[date];
          const avg =
            scores.reduce((a, b) => a + b, 0) / scores.length;

          return { date, score: avg };
        });

          


        setMonthlyData(monthlyFormatted); // ✅ FIXED

        // 2️⃣ Fetch analytics
        const analyticsRes = await axios.get(
          "http://127.0.0.1:8000/analytics"
        );
        setStats(analyticsRes.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">Posture Dashboard</h1>

      {/* 🔥 STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <p className="text-gray-400">Average</p>
            <h2 className="text-2xl font-bold">{stats.average}</h2>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <p className="text-gray-400">Best</p>
            <h2 className="text-2xl font-bold">{stats.best}</h2>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <p className="text-gray-400">Weekly Improvement</p>
            <h2 className="text-2xl font-bold text-green-400">
              {stats.improvement >= 0 ? "+" : ""}
              {stats.improvement}
            </h2>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow">
            <p className="text-gray-400">Total Scans</p>
            <h2 className="text-2xl font-bold">{data.length}</h2>
          </div>

        </div>
      )}

      {/* 🔥 INSIGHT */}
      {stats && (
        <div className="bg-yellow-500/10 border border-yellow-400 text-yellow-300 p-4 rounded-lg mb-8">
          Most Common Issue: <b>{stats.common_issue}</b>
        </div>
      )}

      {/* 📊 FIRST CHART */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex justify-center">
        {data.length > 0 ? (
          <LineChart width={700} height={300} data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="name" />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#00ff99"
              strokeWidth={3}
            />
          </LineChart>
        ) : (
          <p className="text-gray-400">
            No data yet. Start analysis to see your posture trends.
          </p>
        )}
      </div>

      {/* 📅 MONTHLY CHART */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-10 flex flex-col items-center">

        <h2 className="text-xl font-semibold mb-4 text-gray-300">
          Monthly Progress
        </h2>

        {monthlyData.length > 0 ? (
          <LineChart width={700} height={300} data={monthlyData}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="date" />
            <YAxis
          domain={[90, 100]}
          tick={{ fill: "#ccc" }}
          tickCount={6}
        />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#ffcc00"
              strokeWidth={3}
            />
          </LineChart>
        ) : (
          <p className="text-gray-400">
            No monthly data available yet.
          </p>
        )}

      </div>

    </div>
  );
}

export default Dashboard;