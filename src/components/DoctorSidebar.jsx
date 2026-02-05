import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function DoctorSidebar() {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition";

  const activeClass = "bg-blue-100 text-blue-700 font-semibold";

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-4">
      <h2 className="text-xl font-bold text-blue-600 mb-6">
        Smart Asthma
      </h2>

      <nav className="space-y-2">
        <NavLink
          to="/doctor"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <HomeIcon className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/doctor/patients"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <UsersIcon className="w-5 h-5" />
          Patients
        </NavLink>

        <NavLink
          to="/doctor/logs"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
          Daily Logs
        </NavLink>

        {/* ✅ SETTINGS */}
        <NavLink
          to="/doctor/settings"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Cog6ToothIcon className="w-5 h-5" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
