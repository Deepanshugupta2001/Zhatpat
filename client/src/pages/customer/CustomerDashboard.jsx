import { useAuth } from "../../context/authContext.jsx";

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <main>
      <h1>Customer Dashboard</h1>
      <p>Welcome back, {user?.name || "customer"}.</p>
    </main>
  );
};

export default CustomerDashboard;
