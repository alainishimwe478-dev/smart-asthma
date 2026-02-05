import { Outlet } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";

export default function DoctorLayout() {
  return (
    <div className="0ksqforw flex">
      <DoctorSidebar />
      <main className="033zwavr flex-1 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
