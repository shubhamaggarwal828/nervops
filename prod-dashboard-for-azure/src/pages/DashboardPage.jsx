import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import UptimeDashboard from "../components/Dashboard/TempDash";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <UptimeDashboard />
    </div>
  );
};
export default DashboardPage;
