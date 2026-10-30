import { signOut } from "firebase/auth";
import { Link } from "react-router";
import { auth } from "../../services/firebaseConnection";
import { FiLogOut } from "react-icons/fi";

export default function DashBoardNav() {
  async function handleLogout() {
    await signOut(auth);
  }
  return (
    <nav className="bg-red-600 text-white h-11 flex items-center rounded-lg mt-5 mb-11 px-5 justify-between ">
      <div className=" flex gap-4 items-center">
        <Link to={"/dashboard"}>Dashboard</Link>
        <Link to={"/dashboard/new"}>Novo Carro</Link>
      </div>

      <button
        className="cursor-pointer flex items-center gap-2"
        onClick={handleLogout}
      >
        Sair da conta
        <FiLogOut color="#fff" size={24} />
      </button>
    </nav>
  );
}
