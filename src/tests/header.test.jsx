import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import App from "../pages/App";

test('Renders heading element', () => {
    render(<App />)
    const mainPageHeading = screen.getByTestId('app-main-heading')
    expect(mainPageHeading).toBeInTheDocument()
})

