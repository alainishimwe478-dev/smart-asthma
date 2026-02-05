import React, { useState, useEffect, useRef } from "react";
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
import { FiActivity, FiClipboard } from "react-icons/fi";
import { FaSignOutAlt, FaBell, FaPaperPlane } from "react-icons/fa";

function DashboardHome({ email }) {
  const [prediction, setPrediction] = useState({
    level: "moderate",
    aqi: 85,
    temp: 28,
    humidity: 70,
  });

  const [climate, setClimate] = useState({
    aqi: 85,
    temp: 28,
    humidity: 70,
    condition: "Moderate",
    risk: "moderate", // low | moderate | high
  });

  const [dailyLog, setDailyLog] = useState({
    symptoms: "",
    activityLevel: "",
    notes: "",
    inhalerUsed: 0,
  });

  const [logsHistory, setLogsHistory] = useState([]); // saved logs

  const [smartDailyLogData, setSmartDailyLogData] = useState({
    symptoms: "",
    activityLevel: "",
    notes: "",
    inhalerUsed: 0,
    climateRisk: climate.condition,
    climateAdvice: "",
  });

  const [asthmaControl, setAsthmaControl] = useState(82);
  const [inhalerUses, setInhalerUses] = useState(2);
  const [peakFlow, setPeakFlow] = useState(450);
  const [personalBest, setPersonalBest] = useState(490);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Appointment tomorrow at 10 AM", type: "info" },
    { id: 2, message: "High pollen count today", type: "alert" },
    { id: 3, message: "Medication refill reminder", type: "info" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { sender: "doctor", text: "Hello! Remember to take your inhaler." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const recentSymptoms = [
    { name: "Mild Cough", time: "Today, 09:00 AM" },
    { name: "Shortness of Breath", time: "Yesterday, 2:45 PM" },
    { name: "Nighttime Wheeze", time: "2 days ago" },
  ];

  const triggers = [
    "Pollen Count High",
    "Smoke Alert Nearby",
    "Cold Air Detected",
  ];

  const asthmaData = [
    { day: "Mon", attacks: 1, steps: 5000 },
    { day: "Tue", attacks: 0, steps: 6200 },
    { day: "Wed", attacks: 2, steps: 4800 },
    { day: "Thu", attacks: 1, steps: 7000 },
    { day: "Fri", attacks: 0, steps: 8000 },
    { day: "Sat", attacks: 1, steps: 7500 },
    { day: "Sun", attacks: 0, steps: 6000 },
  ];

  const medicationAdherenceData = [
    { day: "Mon", taken: 2, missed: 0 },
    { day: "Tue", taken: 1, missed: 1 },
    { day: "Wed", taken: 2, missed: 0 },
    { day: "Thu", taken: 1, missed: 1 },
    { day: "Fri", taken: 2, missed: 0 },
    { day: "Sat", taken: 2, missed: 0 },
    { day: "Sun", taken: 1, missed: 1 },
  ];

  // Calculate adherence percentage
  const totalDoses = medicationAdherenceData.reduce(
    (sum, d) => sum + d.taken + d.missed,
    0
  );

  const totalTaken = medicationAdherenceData.reduce(
    (sum, d) => sum + d.taken,
    0
  );

  const adherencePercent = Math.round((totalTaken / totalDoses) * 100);

  // Climate → Asthma Risk Engine (Smart Logic)
  const calculateClimateRisk = (aqi, temp, humidity) => {
    if (aqi > 120 || humidity > 80 || temp < 15) {
      return { level: "high", label: "High Risk" };
    }
    if (aqi > 70 || humidity > 65) {
      return { level: "moderate", label: "Moderate Risk" };
    }
    return { level: "low", label: "Low Risk" };
  };

  const climateTableData = [
    {
      factor: "Air Quality (AQI)",
      value: climate.aqi,
      status:
        climate.aqi > 120
          ? "Poor"
          : climate.aqi > 70
          ? "Moderate"
          : "Good",
      advice:
        climate.aqi > 120
          ? "Avoid outdoor activities"
          : climate.aqi > 70
          ? "Outdoor activity with caution"
          : "Safe for outdoor activities",
    },
    {
      factor: "Temperature",
      value: `${climate.temp} °C`,
      status:
        climate.temp > 30
          ? "Hot"
          : climate.temp < 18
          ? "Cold"
          : "Normal",
      advice:
        climate.temp > 30
          ? "Stay hydrated & avoid heat"
          : climate.temp < 18
          ? "Cold air may trigger asthma"
          : "Comfortable temperature",
    },
    {
      factor: "Humidity",
      value: `${climate.humidity}%`,
      status:
        climate.humidity > 75
          ? "High"
          : climate.humidity < 40
          ? "Low"
          : "Normal",
      advice:
        climate.humidity > 75
          ? "Risk of mold & breathing issues"
          : "Comfortable breathing conditions",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isDoctorAlert = prediction.level === "high" || prediction.aqi > 100;

  const notifyDoctor = () => {
    alert(
      "🚨 Doctor Alert Sent!\n\n" +
        "Patient shows HIGH asthma risk today.\n" +
        `AQI: ${prediction.aqi}\n` +
        `Temperature: ${prediction.temp}°C\n` +
        `Humidity: ${prediction.humidity}%`
    );
  };

  const doctorAdvice = () => {
    if (prediction.level === "high") {
      return "⚠️ High asthma risk today! Avoid outdoor activities and keep inhaler ready.";
    } else if (prediction.level === "moderate") {
      return "🌤 Moderate risk. Monitor symptoms and carry inhaler when outdoors.";
    } else {
      return "✅ Low risk. Maintain normal activities and follow your medication schedule.";
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: "user", text: chatInput }]);
    setChatInput("");

    // Mock doctor reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "doctor", text: "Thanks for the update! Keep monitoring your symptoms." },
      ]);
    }, 1500);
  };

  const handleDailyLogChange = (e) => {
    const { name, value } = e.target;
    setDailyLog((prev) => ({ ...prev, [name]: value }));
  };

  const submitDailyLog = () => {
    const newLog = {
      ...dailyLog,
      date: new Date().toLocaleDateString(),
    };
    setLogsHistory((prev) => [newLog, ...prev]);
    setDailyLog({
      symptoms: "",
      activityLevel: "",
      notes: "",
      inhalerUsed: 0,
    });
    alert("✅ Daily Log Submitted!");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Auto-update climate data (simulated live monitoring)
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedAQI = Math.floor(50 + Math.random() * 80);
      const simulatedTemp = Math.floor(18 + Math.random() * 15);
      const simulatedHumidity = Math.floor(40 + Math.random() * 50);

      const risk = calculateClimateRisk(
        simulatedAQI,
        simulatedTemp,
        simulatedHumidity
      );

      setClimate({
        aqi: simulatedAQI,
        temp: simulatedTemp,
        humidity: simulatedHumidity,
        condition: risk.label,
        risk: risk.level,
      });
    }, 10000); // updates every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Climate → Medication Priority (auto-alerts)
  useEffect(() => {
    if (climate.risk === "high") {
      alert(
        "🌍 HIGH CLIMATE RISK\n\nAir quality or weather may trigger asthma.\nEnsure rescue inhaler is accessible."
      );
    }
  }, [climate.risk]);

  // Auto-update climate advice in the log
  useEffect(() => {
    let advice = "";

    if (climate.risk === "high") {
      advice = "⚠️ High risk today! Limit outdoor activity and keep inhaler ready.";
    } else if (climate.risk === "moderate") {
      advice = "🌤 Moderate risk. Monitor symptoms and take precautions.";
    } else {
      advice = "✅ Low risk. Normal activities can continue.";
    }

    setSmartDailyLogData((prev) => ({
      ...prev,
      climateRisk: climate.condition,
      climateAdvice: advice,
    }));
  }, [climate]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Welcome Back, {email || "User"}!</h2>
          <p className="text-blue-100">Monitor your asthma attacks, steps, and medication adherence this week.</p>
        </div>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-white text-xl hover:text-yellow-200"
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-10 w-80 bg-white shadow-xl rounded-xl p-4 z-50">
              <h4 className="font-semibold mb-2 text-gray-700">Notifications</h4>
              <ul className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="py-2 border-b last:border-none text-gray-800">
                    {n.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 shadow-md"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Top Medical Cards */}
      <section className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Asthma Control */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
          <h4 className="text-sm mb-1">Today's Asthma Control</h4>
          <p className="text-2xl font-bold">{asthmaControl} / 100</p>
          <div className="w-full bg-green-200 rounded-full h-3 mt-3">
            <div
              className="bg-white h-3 rounded-full"
              style={{ width: `${asthmaControl}%` }}
            />
          </div>
          <p className="mt-1 font-semibold">✔ Good</p>
        </div>

        {/* Inhaler Uses */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
          <h4 className="text-sm mb-1">Inhaler Uses Today</h4>
          <p className="text-2xl font-bold">{inhalerUses} Uses</p>
          <p className="mt-2">Normal Usage</p>
        </div>

        {/* Peak Flow */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
          <h4 className="text-sm mb-1">Last Peak Flow</h4>
          <p className="text-2xl font-bold">{peakFlow} L/min</p>
          <div className="w-full bg-yellow-200 rounded-full h-3 mt-3">
            <div
              className={`h-3 rounded-full ${peakFlow >= personalBest*0.9 ? 'bg-white' : 'bg-gray-800'}`}
              style={{ width: `${(peakFlow/personalBest)*100}%` }}
            />
          </div>
          <p className="mt-1 text-white/80">Personal Best: {personalBest} L/min</p>
        </div>
      </section>

      {/* Prediction & Alerts */}
      <section className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition ${
            prediction.level === "high"
              ? "bg-red-100 border-l-8 border-red-500"
              : prediction.level === "moderate"
              ? "bg-yellow-100 border-l-8 border-yellow-400"
              : "bg-green-100 border-l-8 border-green-500"
          }`}
        >
          <h3 className="text-lg font-bold mb-2">🌍 Asthma Risk Prediction</h3>
          <p className="mb-1"><strong>Status:</strong> {prediction.level.toUpperCase()}</p>
          <p className="mb-1"><strong>AQI:</strong> {prediction.aqi}</p>
          <p className="mb-1"><strong>Temp:</strong> {prediction.temp}°C</p>
          <p className="mb-1"><strong>Humidity:</strong> {prediction.humidity}%</p>
          <p className="mt-2 font-semibold">{doctorAdvice()}</p>
        </div>

        {isDoctorAlert && (
          <div className="bg-red-100 border-l-8 border-red-500 p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
            <h3 className="text-lg font-bold text-red-700 mb-2">
              🚨 High Risk Alert – Doctor Notification
            </h3>
            <p className="text-red-800 mb-3">
              Current weather and air quality indicate a HIGH asthma risk. Doctor should be notified.
            </p>
            <button
              onClick={notifyDoctor}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 shadow-md transition"
            >
              Notify Doctor Now
            </button>
          </div>
        )}
      </section>

      {/* Climate Intelligence Panel */}
      <section className="p-4 sm:p-8">
        <div
          className={`rounded-xl shadow-xl p-6 transform hover:scale-105 transition ${
            climate.risk === "high"
              ? "bg-red-100 border-l-8 border-red-500"
              : climate.risk === "moderate"
              ? "bg-yellow-100 border-l-8 border-yellow-500"
              : "bg-green-100 border-l-8 border-green-500"
          }`}
        >
          <h3 className="text-xl font-semibold mb-3">
            🌍 Live Climate & Air Quality
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-800">
            <div>
              🌫 AQI
              <p className="text-2xl font-bold">{climate.aqi}</p>
            </div>

            <div>
              🌡 Temperature
              <p className="text-2xl font-bold">{climate.temp}°C</p>
            </div>

            <div>
              💧 Humidity
              <p className="text-2xl font-bold">{climate.humidity}%</p>
            </div>
          </div>

          <p className="mt-4 font-semibold">
            Risk Level:{" "}
            <span
              className={`${
                climate.risk === "high"
                  ? "text-red-700"
                  : climate.risk === "moderate"
                  ? "text-yellow-700"
                  : "text-green-700"
              }`}
            >
              {climate.condition}
            </span>
          </p>
        </div>
      </section>

      {/* Charts & Doctor Chat */}
      <section className="p-4 sm:p-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Asthma Attacks */}
        <div className="bg-white shadow-xl rounded-xl p-5 transform hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-4">Weekly Asthma Attacks</h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={asthmaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attacks" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Steps */}
        <div className="bg-white shadow-xl rounded-xl p-5 transform hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-4">Daily Steps</h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={asthmaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medication Adherence */}
        <div className="bg-white shadow-xl rounded-xl p-5 transform hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">💊 Medication Adherence</h3>

          <p className="text-sm text-gray-600 mb-3">
            Weekly adherence score:{" "}
            <span
              className={`font-bold ${
                adherencePercent >= 80
                  ? "text-green-600"
                  : adherencePercent >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {adherencePercent}%
            </span>
          </p>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={medicationAdherenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="taken"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Taken"
                />
                <Line
                  type="monotone"
                  dataKey="missed"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Missed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Chat */}
        <div className="bg-white shadow-xl rounded-xl p-5 flex flex-col transform hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-3">💬 Chat with Doctor</h3>
          <div className="flex-1 overflow-y-auto mb-2 h-64 p-2 border rounded-lg">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.sender === "doctor" ? "text-left" : "text-right"}`}>
                <span className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === "doctor" ? "bg-gray-200 text-gray-900" : "bg-blue-500 text-white"
                }`}>
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
            />
            <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </section>

      {/* ================= DAILY LOG ================= */}
      <section className="p-4 sm:p-8 space-y-6">
        {/* Daily Log Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📋 Daily Log
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Symptoms (comma separated)</label>
              <input
                type="text"
                name="symptoms"
                value={dailyLog.symptoms}
                onChange={handleDailyLogChange}
                placeholder="Cough, Wheezing, Shortness of Breath"
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Activity Level</label>
              <select
                name="activityLevel"
                value={dailyLog.activityLevel}
                onChange={handleDailyLogChange}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Inhaler Used (times)</label>
              <input
                type="number"
                name="inhalerUsed"
                value={dailyLog.inhalerUsed}
                onChange={handleDailyLogChange}
                className="w-32 mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                value={dailyLog.notes}
                onChange={handleDailyLogChange}
                placeholder="Feeling tired after walking..."
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Risk Banner */}
          <div
            className={`mt-4 p-4 rounded-lg flex items-center gap-2 font-medium ${
              climate.risk === "high"
                ? "bg-red-100 text-red-700"
                : climate.risk === "moderate"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            ⚠️ {climate.condition}: {smartDailyLogData.climateAdvice}
          </div>

          <button
            onClick={submitDailyLog}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Daily Log
          </button>
        </div>

        {/* ================= LOG HISTORY ================= */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📑 Daily Logs History
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Symptoms</th>
                  <th className="p-2 text-left">Activity</th>
                  <th className="p-2 text-center">Inhaler</th>
                  <th className="p-2 text-center">AQI</th>
                  <th className="p-2 text-center">Temp</th>
                  <th className="p-2 text-center">Humidity</th>
                  <th className="p-2 text-center">Risk</th>
                  <th className="p-2 text-left">Advice</th>
                </tr>
              </thead>
              <tbody>
                {logsHistory.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center p-4 text-gray-500">
                      No logs submitted yet
                    </td>
                  </tr>
                )}

                {logsHistory.map((log, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{log.date}</td>
                    <td className="p-2">{log.symptoms || "—"}</td>
                    <td className="p-2">{log.activityLevel}</td>
                    <td className="p-2 text-center">{log.inhalerUsed}</td>
                    <td className="p-2 text-center">{climate.aqi}</td>
                    <td className="p-2 text-center">{climate.temp}°C</td>
                    <td className="p-2 text-center">{climate.humidity}%</td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          climate.risk === "high"
                            ? "bg-red-500 text-white"
                            : climate.risk === "moderate"
                            ? "bg-yellow-400 text-black"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {climate.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2">{smartDailyLogData.climateAdvice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-between transform hover:scale-105 transition cursor-pointer"
          onClick={() => window.location.href = "/user/daily-log"}
        >
          <h3 className="text-lg font-semibold mb-2">📋 Daily Logs</h3>
          <p className="text-white/90">Track your symptoms and activities daily.</p>
        </div>

        <div
          className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-between transform hover:scale-105 transition cursor-pointer"
          onClick={() => window.location.href = "/user/medication"}
        >
          <h3 className="text-lg font-semibold mb-2">💊 Medications</h3>
          <p className="text-white/90">View your medication schedule and doses.</p>
        </div>

        <div
          className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-between transform hover:scale-105 transition cursor-pointer"
          onClick={() => window.location.href = "/user/reports"}
        >
          <h3 className="text-lg font-semibold mb-2">📊 Reports</h3>
          <p className="text-white/90">Analyze your asthma history and trends.</p>
        </div>

        <div
          className="bg-gradient-to-br from-red-400 to-red-500 text-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-between transform hover:scale-105 transition cursor-pointer"
          onClick={() => window.location.href = "/user/admin"}
        >
          <h3 className="text-lg font-semibold mb-2">📅 Admin Dashboard</h3>
          <p className="text-white/90">Access administrative features and settings.</p>
        </div>
      </section>
    </div>
  );
}

export default DashboardHome;
