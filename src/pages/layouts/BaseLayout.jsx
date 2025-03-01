import { Outlet } from "react-router";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import "../../styles/header.css"
import "../../styles/footer.css"

export function BaseLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}