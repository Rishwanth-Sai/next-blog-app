import ProfileMenu from "@/Components/ProfileMenu";
import Sidebar from "@/Components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-4 max-h-17 px-12 border-b border-black bg-white dark:bg-amber-50">
            <h3 className="font-medium">User Dashboard</h3>
            <ProfileMenu showDashboardLink={false} />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
