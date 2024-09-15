import { Outlet, RouterProvider } from "react-router-dom";
import router from "./router";
import { UserProvider } from "./contexts/User";

function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;