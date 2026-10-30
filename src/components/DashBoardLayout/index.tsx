import { Outlet } from "react-router";
import DashBoardNav from "../DashBoardNav";

export default function DashBoardLayout() {
  return (
    <>
      <DashBoardNav />
      <Outlet />
    </>
  );
}
