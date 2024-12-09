import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserRoute from "./User/UserRoute";
import AdminRoute from "./Admin/AdminRoute";

function App() {
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div data-theme="forest">
        {pathname.startsWith("/admin") ? <AdminRoute /> : <UserRoute />}
      </div>
    </>
  );
}

export default App;
