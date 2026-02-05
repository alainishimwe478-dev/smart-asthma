import React from "react";
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

export default function ClimateChart({ data }) {
  // Custom dot color based on AQI
  const renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    let fill = "green";
    if (payload.aqi > 150) fill = "red";
    else if (payload.aqi > 80) fill = "yellow";
    return (
      <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#000" strokeWidth={1} />
    );
  };

  // Generate dynamic notifications based on AQI data
  const generateNotifications = () => {
    if (!data || data.length === 0) return [];

    const latestAQI = data[data.length - 1].aqi;
    const notifications = [];

    if (latestAQI > 150) {
      notifications.push({
        message:
          "🚨 High AQI detected! Avoid outdoor activities and use inhaler as needed.",
        type: "alert",
      });
    } else if (latestAQI > 80) {
      notifications.push({
        message:
          "⚠️ Moderate AQI levels. Monitor symptoms and limit outdoor exposure.",
        type: "warning",
      });
    } else {
      notifications.push({
        message: "✅ Air quality is safe. Enjoy your day!",
        type: "info",
      });
    }

    // Check for increasing trend
    if (data.length >= 2) {
      const prevAQI = data[data.length - 2].aqi;
      if (latestAQI > prevAQI + 20) {
        notifications.push({
          message: "📈 AQI is rising rapidly. Stay indoors if possible.",
          type: "warning",
        });
      }
    }

    return notifications;
  };

  const notifications = generateNotifications();

  return (
    <div className="02bd88fy bg-white p-6 rounded-xl shadow mb-6">
      {/* Notification Panel */}
      {notifications.length > 0 && (
        <div className="0357j99f mb-6">
          <h3 className="0gj0k96u font-semibold mb-2">🔔 Notifications</h3>
          <ul className="02c1a53j space-y-2">
            {notifications.map((note, idx) => (
              <li
                key={idx}
                className={`0fdrl65k p-3 rounded-md text-white ${
                  note.type === "alert"
                    ? "bg-red-500"
                    : note.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              >
                {note.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="07ourh5g font-semibold mb-4">
        🌫 AQI Trend Over the Day (Gradient)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="red" />
              <stop offset="50%" stopColor="yellow" />
              <stop offset="100%" stopColor="green" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 200]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="url(#aqiGradient)"
            strokeWidth={3}
            dot={renderCustomDot}
            name="AQI"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
