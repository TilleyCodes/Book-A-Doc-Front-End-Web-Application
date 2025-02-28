import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Home } from "../pages/Home";
// import userEvent from "@testing-library/user-event";

test('Renders heading element in Header', () => {
    render(<Header />)
    const mainPageHeading = screen.getByTestId('app-header-heading')
    expect(mainPageHeading).toBeInTheDocument()
})

test('Renders heading element in Footer', () => {
    render(<Footer />)
    const mainPageHeading = screen.getByTestId('app-footer-heading')
    expect(mainPageHeading).toBeInTheDocument()
})

test('Renders heading element in Home', () => {
    render(<Home />)
    const mainPageHeading = screen.getByTestId('app-home-heading')
    expect(mainPageHeading).toBeInTheDocument()
})
