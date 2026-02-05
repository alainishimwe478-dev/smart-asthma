import { useEffect, useState } from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Chat from "../components/ChatWidget";
import { useAlerts } from "../components/Alerts";

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState("");

  useAlerts();

  useEffect(() => {
    setPatients([
      { id: 1, name: "John Doe", risk: "High", heart_rate: 110, oxygen: 91 },
      { id: 2, name: "Jane Smith", risk: "Moderate", heart_rate: 98, oxygen: 95 },
    ]);
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;

    setDailyLogs([
      { id: 1, date: "2026-02-01", note: "Mild wheezing at night." },
      { id: 2, date: "2026-02-03", note: "Prescribed inhaler dosage increased." },
    ]);

    setShowForm(false);
  }, [selectedPatient]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    setDailyLogs([
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        note: newNote,
      },
      ...dailyLogs,
    ]);

    setNewNote("");
    setShowForm(false);
  };

  return (
    <div className="0nouchee min-h-screen bg-gray-100">
      {/* Header */}
      <header className="0t7xv4g2 bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="071frnzz text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <div className="0pf63pwx flex gap-4">
          <BellIcon className="0oosxcz6 w-6 h-6 text-gray-600" />
          <UserCircleIcon className="06hdy88e w-8 h-8 text-gray-600" />
        </div>
      </header>

      <main className="00frpnbb grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Patients List */}
        <section className="0m1lryu1 bg-white rounded-xl shadow p-4">
          <h2 className="0csf6cf3 font-semibold text-lg mb-4">Assigned Patients</h2>

          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPatient(p)}
              className={`0m2jyu4a p-4 mb-3 rounded-lg border cursor-pointer transition ${
                selectedPatient?.id === p.id
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <p className="0dmr073c font-medium text-gray-800">{p.name}</p>
              <span
                className={`0eq7cxoy text-sm font-semibold ${
                  p.risk === "High"
                    ? "text-red-600"
                    : p.risk === "Moderate"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                Risk: {p.risk}
              </span>
            </div>
          ))}
        </section>

        {/* Patient Details & Daily Logs */}
        <section className="07yftflb bg-white rounded-xl shadow p-5 col-span-1">
          {selectedPatient ? (
            <>
              <h2 className="0tqyyjw6 text-lg font-semibold mb-3">
                {selectedPatient.name}
              </h2>

              {/* Vitals */}
              <div className="0ehy0v3e grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="066sewyd bg-gray-50 p-3 rounded-lg">
                  ❤️ Heart Rate
                  <p className="03j9ycfs font-bold">{selectedPatient.heart_rate} bpm</p>
                </div>
                <div className="0q3ehm51 bg-gray-50 p-3 rounded-lg">
                  🫁 Oxygen Level
                  <p className="0sdmu3yk font-bold">{selectedPatient.oxygen}%</p>
                </div>
              </div>

              {/* Daily Logs */}
              <h3 className="0781l11e font-semibold mb-2">Daily Logs</h3>
              <div className="02jg3z3t max-h-60 overflow-y-auto space-y-3 mb-4">
                {dailyLogs.map((log) => (
                  <div
                    key={log.id}
                    className="0z36jl1m p-3 bg-gray-50 rounded-lg border"
                  >
                    <p className="0hp3zfyf text-xs text-gray-500">{log.date}</p>
                    <p className="09tz9bgq text-sm text-gray-700">{log.note}</p>
                  </div>
                ))}
              </div>

              {/* Add Note */}
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="0t7287z2 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  + Add Medical Note
                </button>
              ) : (
                <div className="0yvimbsl space-y-3">
                  <textarea
                    className="0niqmmgl w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="0r4yrc1u flex gap-3">
                    <button
                      onClick={handleAddNote}
                      className="0r2cyxlp flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="0uczx91m flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="0vwnlvzz text-gray-500 text-center mt-10">
            </p>
          )}
        </section>

        {/* Chat */}
        <section className="0k0rqcmp bg-white rounded-xl shadow p-4">
          <h2 className="01ijd0r9 font-semibold mb-3">Patient Chat</h2>
          {selectedPatient ? (
            <Chat room={`doctor-patient-${selectedPatient.id}`} />
          ) : (
            <p className="0mfp3kmg text-gray-500">Select a patient to chat</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default DoctorDashboard;
