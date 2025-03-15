import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { UserJwtContext } from '../hooks/useUserJwtData';

// Mock the fetch API
window.fetch = vi.fn();

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('LoginForm Component', () => {
  const mockSetUserJwtData = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    window.fetch.mockClear();
    mockNavigate.mockClear();
    
    render(
      <BrowserRouter>
        <UserJwtContext.Provider value={{ setUserJwtData: mockSetUserJwtData }}>
          <LoginForm />
        </UserJwtContext.Provider>
      </BrowserRouter>
    );
  });
  
  it('renders the login form correctly with required fields', () => {
    // Check for email and password fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    
    // Check for login button
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    
    // Check for forgot password link
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });
  
  it('handles form submission with correct credentials', async () => {
    // Mock successful API response
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        token: 'fake-jwt-token',
        patient: { _id: 'patient123', firstName: 'John', lastName: 'Doe' }
      })
    });
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for the API call to complete
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledTimes(1);
      expect(mockSetUserJwtData).toHaveBeenCalledWith({
        token: 'fake-jwt-token',
        patient: { _id: 'patient123', firstName: 'John', lastName: 'Doe' },
        patientId: 'patient123'
      });
    });
    
    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  it('displays error message when login fails', async () => {
    // Mock failed API response
    window.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        message: 'Invalid email or password'
      })
    });
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
