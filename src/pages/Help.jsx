import { Link } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

export default function Help() {
  return (
    <>
      <p>
        If you need assistance, you can reach us through the following channels:
      </p>
      <ul>
        <li className="flex items-center p-2 hover:bg-gray-75 rounded-md">
          <FaPhone className="h-6 w-6" />
          <span className="ml-3">
            <strong>Phone:</strong>+62 82324445023
          </span>
        </li>
        <li className="flex items-center p-2 hover:bg-gray-75 rounded-md">
          <FaEnvelope className="h-6 w-6" />
          <span className="ml-3">
            <strong>Email:</strong> alexveros46@gmail.com
          </span>
        </li>
        <li className="flex items-center p-2 hover:bg-gray-75 rounded-md">
          <FaInstagram className="h-6 w-6" />
          <span className="ml-3">
            <strong>Instagram:</strong> @alexveros
          </span>
        </li>
        <li className="flex items-center p-2 hover:bg-gray-75 rounded-md">
          <FaTwitter className="h-6 w-6" />
          <span className="ml-3">
            <strong>Twitter:</strong> @alexveros
          </span>
        </li>
        <li className="flex items-center p-2 hover:bg-gray-75 rounded-md">
          <FaFacebook className="h-6 w-6" />
          <span className="ml-3">
            <strong>Facebook:</strong> Alex
          </span>
        </li>
      </ul>
    </>
  );
}
