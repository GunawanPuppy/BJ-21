import { FaBuilding } from "react-icons/fa";
import { GiCardAceSpades } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";
import { IoMdHelp } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import Swal from 'sweetalert2';

export default function Sidebar({ theme, toggleTheme }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Gak Lanjut Judi Bro? Nanti Nyesal ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes"
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        localStorage.clear();
        Swal.fire({
          title: "YAAA SALDONYA ABIS Pinjol Dulu Sana!!!!!",
          text: "Logout Has been Successfull",
          icon: "success"
        });

        setTimeout(() => {
          navigate("/auth/login");
        }, 500);
      } catch (error) {
        console.error("Error logging out: ", error);
        Swal.fire({
          title: "Error!",
          text: "Logout failed. Please try again.",
          icon: "error"
        });
      }
    }
  };

  return (
    <div
      className={`h-full flex flex-col justify-between ${
        theme === "green"
          ? "bg-gradient-to-b from-green-900 via-blue-300 to-yellow-300"
          : "bg-gradient-to-b from-yellow-900 via-red-400 to-orange-200"
      } text-white overflow-y-auto`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">A L I CASINO</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/lobby"
              className="flex items-center p-2 hover:bg-gray-75 rounded-md"
            >
              <FaBuilding className="h-6 w-6" />
              <span className="ml-3">Lobby</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="flex items-center p-2 hover:bg-gray-75 rounded-md"
            >
              <RxDashboard className="h-6 w-6" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center p-2 hover:bg-gray-75 rounded-md"
            >
              <CgProfile className="h-6 w-6" />
              <span className="ml-3">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/listcards"
              className="flex items-center p-2 hover:bg-gray-75 rounded-md"
            >
              <GiCardAceSpades className="h-6 w-6" />
              <span className="ml-3">List Cards</span>
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className="flex items-center p-2 hover:bg-gray-75 rounded-md"
            >
              <IoMdHelp className="h-6 w-6" />
              <span className="ml-3">Help n Support</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span>Toggle Theme</span>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              checked={theme === "green"}
              onChange={toggleTheme}
            />
            <div className="relative w-10 h-4 bg-gray-400 rounded-full shadow-inner">
              <div
                className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform ${
                  theme === "green" ? "transform translate-x-full bg-green-500" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center p-2 hover:bg-gray-75 rounded-md w-full mt-4"
        >
          <TbLogout className="h-6 w-6" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
}
