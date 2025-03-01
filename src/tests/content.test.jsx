import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
// import userEvent from "@testing-library/user-event";

test('Renders home text on home page', () => {
    render(<Home />)
    const mainPageContent = screen.getByText(/home/i)
    expect(mainPageContent).toBeInTheDocument()
})

test('Renders about text on about page', () => {
    render(<About />)
    const aboutPageContent = screen.getByText(/about/i)
    expect(aboutPageContent).toBeInTheDocument()
})

test('Renders contact text on contact page', () => {
    render(<Contact />)
    const contactPageContent = screen.getByText(/contact/i)
    expect(contactPageContent).toBeInTheDocument()
})

test('Renders header text on header page', () => {
    render(<Header />)
    const headerPageContent = screen.getByText(/header/i)
    expect(headerPageContent).toBeInTheDocument()
})

test('Renders footer text on footer page', () => {
    render(<Footer />)
    const footerPageContent = screen.getByText(/footer/i)
    expect(footerPageContent).toBeInTheDocument()
})