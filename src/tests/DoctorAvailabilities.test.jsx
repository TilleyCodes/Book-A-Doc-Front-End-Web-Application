import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { DoctorAvailabilities } from '../components/DoctorAvailabilities';
import { UserJwtContext } from '../hooks/useUserJwtData';

// Mock navigate
const mockNavigate = vi.fn();

// Mock fetch API
window.fetch = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('DoctorAvailabilities Component', () => {
  const mockDoctor = { 
    _id: 'doc1', 
    doctorName: 'Dr. Jane Smith', 
    specialtyId: { specialtyName: 'GP Women\'s Health' } 
  };
  
  const mockMedicalCentre = {
    _id: 'mc1',
    medicalCentreName: 'Medical Centre A',
    address: { street: '123 Test St', city: 'Test City' }
  };
  
  const mockAvailableTimes = ['09:00', '09:30', '10:00', '10:30'];
  
  const mockUserJwtData = {
    token: 'fake-token',
    patientId: 'patient123',
    patient: { _id: 'patient123' }
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Mock API responses
    window.fetch.mockImplementation((url) => {
      if (url.includes('medicalCentres')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockMedicalCentre])
        });
      }
      // For doctors/{doctorId}/availabilities endpoint
      if (url.includes('doctors') && url.includes('availabilities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAvailableTimes)
        });
      }
      if (url.includes('availabilities') && !url.includes('doctors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ _id: 'avail1' })
        });
      }
      if (url.includes('bookings')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ _id: 'booking1' })
        });
      }
      return Promise.reject(new Error(`URL not mocked: ${url}`));
    });
    
    render(
      <BrowserRouter>
        <UserJwtContext.Provider value={{ userJwtData: mockUserJwtData }}>
          <DoctorAvailabilities 
            doctor={mockDoctor} 
            medicalCentreId={mockMedicalCentre._id} 
            onClose={vi.fn()}
          />
        </UserJwtContext.Provider>
      </BrowserRouter>
    );
  });
  
  it('renders the booking interface correctly', async () => {
    // Check doctor name is displayed
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    
    // Check specialty is displayed
    expect(screen.getByText('GP Women\'s Health')).toBeInTheDocument();
    
    // Check medical centre is loaded
    await waitFor(() => {
      expect(screen.getByText('Medical Centre A')).toBeInTheDocument();
    });
    
    // Check date input is present
    expect(screen.getByLabelText(/select a date/i)).toBeInTheDocument();
  });
  
  it('shows date selection interface', async () => {
    // Confirm date selection UI is present
    const dateInput = screen.getByLabelText(/select a date/i);
    expect(dateInput).toBeInTheDocument();
    
    // select a date
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);
    
    fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } });
    
    // Verify date change occurred
    expect(dateInput.value).toBe(futureDate.toISOString().split('T')[0]);
    
    // Check that time selection heading appears
    await waitFor(() => {
      expect(screen.getByText('Available Times:')).toBeInTheDocument();
    });
  });
  
  it('disables continue button when no time is selected', async () => {
    // Select a date
    const dateInput = screen.getByLabelText(/select a date/i);
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 7);
    
    fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } });
    
    // Verify continue button is disabled initially
    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });
});
