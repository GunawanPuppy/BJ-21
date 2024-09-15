import { createBrowserRouter, redirect } from 'react-router-dom'
import LoginForm from './pages/auth/LoginAuth'
import MainLayout from './pages/auth/MainLayout'
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Register from './pages/auth/RegisterAuth';
import Help from './pages/Help';
import List from './pages/ListCard';
import Lobby from './pages/Lobby';
import AddForm from './pages/Add';
import Game from './pages/game/Game';
import LoadingPage from './Components/Loading';
import Layout from './pages/game/Layout';
import { RoomProvider } from './contexts/RoomContext';

const cekBelumLogin = () => {
  if (!localStorage.access_token) {
    return redirect("/auth/login");
  }
  return null;
};

const cekSudahLogin = () => {
  if (localStorage.access_token) {
    return redirect("/");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    loader: cekBelumLogin,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "Profile",
        element: <Profile />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "listcards",
        element: <List />,
      },
      {
        path: "lobby",
        element: <Lobby />,
      },
      {
        path: "add",
        element: <AddForm />,
      },

    ],
  },
  {
    path: "game/:roomId",
    element: (
      <RoomProvider>
        <Layout />
      </RoomProvider>
    ),
    loader: cekBelumLogin,
    children: [
      {
        path: "",
        element: <Game />,
      },
      {
        path: "lobby",
        element: <LoadingPage />
      }
    ]
  },
  {
    path: "/auth",
    element: <MainLayout />,
    loader: cekSudahLogin,
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <Register />,
      }
    ],
  },
]);

export default router;
