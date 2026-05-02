import { Outlet } from "react-router-dom";

import AppLayout from "../components/app/AppLayout";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { ToastContainer } from "../components/ui/Toast";

export default function AppContainer() {
  return (
    <AppLayout headerComponent={<Header />} sidebarComponent={<Sidebar />}>
      <Outlet />
      <ToastContainer />
    </AppLayout>
  );
}
