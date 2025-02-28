import { Outlet } from "react-router";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";


export function BaseLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}