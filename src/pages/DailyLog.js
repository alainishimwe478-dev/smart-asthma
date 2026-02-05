import React, { useState, useEffect } from "react";
import { FiSave, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const API_KEY = "35fee9482c065271b4fd5ab34ab11272";
const CITY = "Kigali";

function DailyLog() {
  const [form, setForm] = useState({
    date: "",
    breathing: "none",
    chestPain: false,
    cough: "none",
    inhaler: 0,
    activity: "Moderate",
    notes: "",
  });

  const [logs, setLogs] = useState([]);
  const [climate, setClimate] = useState({ temp: "--", humidity: "--", aqi: "--" });
  const [aqiTrend, setAqiTrend] = useState([]);

  // ================= Fetch Weather & AQI =================
  const fetchWeather = async () => {
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();
      const { lat, lon } = weatherData.coord;

      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const aqiData = await aqiRes.json();

      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const aqi = aqiData.list[0].main.aqi * 25;

      setClimate({ temp, humidity, aqi });

      const newReading = {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        aqi,
      };
      setAqiTrend((prev) => [...prev.slice(-5), newReading]);
    } catch (error) {
      console.error("Weather API error:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  // ================= Symptom Severity =================
  const calculateSymptomSeverity = (form) => {
    let score = 0;
    if (form.breathing === "severe") score += 3;
    else if (form.breathing === "moderate") score += 2;
    else if (form.breathing === "mild") score += 1;
    if (form.chestPain) score += 3;
    if (form.cough === "frequent") score += 2;
    else if (form.cough === "occasional") score += 1;
    if (form.inhaler >= 3) score += 3;
    else if (form.inhaler === 2) score += 2;
    return score;
  };

  const getSymptomStatus = (form) => {
    const score = calculateSymptomSeverity(form);
    if (score >= 7) return { level: "HIGH", color: "red", label: "Severe symptoms" };
    if (score >= 4) return { level: "MODERATE", color: "yellow", label: "Moderate symptoms" };
    return { level: "LOW", color: "green", label: "Mild or no symptoms" };
  };

  const getFinalHealthStatus = (form, climate) => {
    const symptomStatus = getSymptomStatus(form);
    if (symptomStatus.level === "HIGH") return { ...symptomStatus, advice: "Immediate care recommended." };
    if (climate.aqi > 150) return { level: "HIGH", color: "red", label: "Poor air quality", advice: "Avoid outdoor exposure." };
    if (symptomStatus.level === "MODERATE" || climate.aqi > 80)
      return { level: "MODERATE", color: "yellow", label: "Monitor condition", advice: "Limit activity and monitor symptoms." };
    return { level: "LOW", color: "green", label: "Stable condition", advice: "Safe conditions." };
  };

  const status = getFinalHealthStatus(form, climate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLogs([{ id: Date.now(), ...form, climate, status }, ...logs]);
    setForm({ date: "", breathing: "none", chestPain: false, cough: "none", inhaler: 0, activity: "Moderate", notes: "" });
  };

  const handleDelete = (id) => setLogs(logs.filter((l) => l.id !== id));

  const getColorAndIcon = (value, type) => {
    let color = "bg-green-100 text-green-700";
    let icon = "✅";

    if (type === "aqi") {
      if (value > 150) { color = "bg-red-100 text-red-700"; icon = "🔥"; }
      else if (value > 80) { color = "bg-yellow-100 text-yellow-700"; icon = "⚠️"; }
    } else if (type === "temp") {
      if (value < 15 || value > 35) { color = "bg-red-100 text-red-700"; icon = "🔥"; }
      else if (value > 30) { color = "bg-yellow-100 text-yellow-700"; icon = "⚠️"; }
    } else if (type === "humidity") {
      if (value > 80) { color = "bg-red-100 text-red-700"; icon = "🔥"; }
      else if (value > 60) { color = "bg-yellow-100 text-yellow-700"; icon = "⚠️"; }
    }

    return { color, icon };
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🌍 Asthma Dashboard</h1>

      {/* Live Climate Panel */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["temp", "humidity", "aqi"].map((type) => {
          const value = climate[type];
          const { color, icon } = getColorAndIcon(value, type);
          const label = type === "temp" ? "Temp" : type === "humidity" ? "Humidity" : "AQI";
          const unit = type === "temp" ? "°C" : type === "humidity" ? "%" : "";
          return (
            <div key={type} className={`p-4 rounded-xl shadow text-center ${color}`}>
              {icon} {label}
              <p className="text-xl font-bold">{value}{unit}</p>
            </div>
          );
        })}
      </div>

      {/* AQI Trend Chart */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-2">📈 AQI Trend</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aqiTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Log Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 mb-8 space-y-4">
        <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded w-full" required />
        <select name="breathing" value={form.breathing} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="none">No breathing difficulty</option>
          <option value="mild">Mild shortness of breath</option>
          <option value="moderate">Moderate shortness of breath</option>
          <option value="severe">Severe shortness of breath</option>
        </select>
        <label className="flex items-center">
          <input type="checkbox" checked={form.chestPain} onChange={(e) => setForm({ ...form, chestPain: e.target.checked })} className="mr-2" />
          Chest pain
        </label>
        <select name="cough" value={form.cough} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="none">No cough</option>
          <option value="occasional">Occasional cough</option>
          <option value="frequent">Frequent cough</option>
        </select>
        <select name="activity" value={form.activity} onChange={handleChange} className="border p-2 rounded w-full">
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>
        <input type="number" name="inhaler" value={form.inhaler} onChange={handleChange} className="border p-2 rounded w-full" placeholder="Inhaler uses" />
        <textarea name="notes" value={form.notes} onChange={handleChange} className="border p-2 rounded w-full" placeholder="Notes" />

        {/* Health Status */}
        <div className={`p-3 rounded-lg flex items-center gap-2 ${status.color === "red" ? "bg-red-100 text-red-700" : status.color === "yellow" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
          <FiAlertTriangle /> {status.label} — {status.advice}
        </div>

        <button className="bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <FiSave /> Save Log
        </button>
      </form>

      {/* Log History */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">📑 Log History</h3>
        {logs.map((log) => (
          <div key={log.id} className="border-b py-2 flex justify-between">
            <span>{log.date} — <span className={log.status.color === "red" ? "text-red-600" : log.status.color === "yellow" ? "text-yellow-600" : "text-green-600"}>{log.status.level}</span></span>
            <button onClick={() => handleDelete(log.id)} className="text-red-600"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyLog;
