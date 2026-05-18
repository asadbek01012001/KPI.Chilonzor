import { Outlet } from "react-router-dom";

import AppLayout from "../components/app/AppLayout";
import Sidebar from "../components/sidebar/Sidebar";
import { ToastContainer } from "../components/ui/Toast";

export default function AppContainer() {
  return (
    <AppLayout sidebarComponent={<Sidebar />}>
      <Outlet />
      <ToastContainer />
    </AppLayout>
  );
}
