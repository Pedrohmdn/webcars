import { Outlet } from "react-router";
import Header from "../Header";
import Container from "../container";

export default function Layout() {
  return (
    <>
      <Header />

      <Container>
        <Outlet />
      </Container>
    </>
  );
}
