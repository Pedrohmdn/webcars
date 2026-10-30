import { Link } from "react-router";
import Logo from "../../assets/logo.svg";
import { FiLogIn, FiUser } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <header className="flex justify-center  h-20  drop-shadow bg-white ">
      <div className="max-w-7xl w-full flex justify-between items-center px-5">
        <Link to={"/"}>
          <img src={Logo} alt="Logo Web Carros" />
        </Link>
        {!loadingAuth && signed ? (
          <Link to={"/dashboard"}>
            <div className="w-10 h-10 flex items-center justify-center border-2 rounded-full border-gray-900">
              <FiUser size={22} color="#000" />
            </div>
          </Link>
        ) : (
          <Link to={"/login"}>
            <div className="w-10 h-10 flex items-center justify-center border-2 rounded-full border-gray-900">
              <FiLogIn size={22} color="#000" />
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
