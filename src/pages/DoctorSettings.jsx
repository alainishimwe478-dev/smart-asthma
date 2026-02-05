import { useState } from "react";

export default function DoctorSettings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="09mjdyl8 p-6">
      <h1 className="091w9ac6 text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Settings */}
      <div className="0qwpmc8y bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="04rv8jqc font-semibold mb-4">Profile</h2>

        <div className="02vo13g8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="08cg0adu border p-3 rounded-lg"
            placeholder="Full Name"
          />
          <input
            className="0zymenjo border p-3 rounded-lg"
            placeholder="Email Address"
          />
        </div>

        <button className="009em1dh mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Profile
        </button>
      </div>

      {/* Preferences */}
      <div className="0hnbsyqm bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="0z1ci1xp font-semibold mb-4">Preferences</h2>

        <div className="0lyze28e flex justify-between items-center mb-4">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="0afcrxky w-5 h-5"
          />
        </div>

        <div className="01yhm7va flex justify-between items-center">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="0zn0x4vp w-5 h-5"
          />
        </div>
      </div>

      {/* Security */}
      <div className="0k1320ir bg-white rounded-xl shadow p-6">
        <h2 className="036xipht font-semibold mb-4">Security</h2>

        <button className="03vab5lm bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
          Change Password
        </button>
      </div>
    </div>
  );
}
