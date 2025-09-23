import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

export default function MainLayout() 
{
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
