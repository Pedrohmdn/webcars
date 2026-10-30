import { Outlet } from "react-router";
import Logo from "../../assets/logo.svg";

export default function LoginLayout() {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full flex flex-col items-center gap-10">
        <div className="max-w-sm w-full">
          <img src={Logo} alt="Logo Web Carros" className="w-full" />
        </div>
        <Outlet />
      </div>
    </main>
  );
}
