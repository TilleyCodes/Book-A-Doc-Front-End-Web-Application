import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useUserJwtContext } from '../hooks/useUserJwtData';
import eyeOpen from '../assets/eye-open.svg';
import eyeClosed from '../assets/eye-closed.svg';
import { endpoints } from '../config/api';

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { setUserJwtData } = useUserJwtContext();

  async function submitForm(event) {
    event.preventDefault();

    const targetUrl = endpoints.login;
    const bodyDataToSend = JSON.stringify({ email, password });

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyDataToSend,
      });

      const bodyData = await response.json();

      if (!response.ok) {
        setLoginSuccessful(false);
        setErrorMessage(bodyData.message || 'Invalid email or password');
        return;
      }
      setLoginSuccessful(true);
      setUserJwtData({
        token: bodyData.token,
        patient: bodyData.patient,
        patientId: bodyData.patient._id,
      });
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      setLoginSuccessful(false);
      setErrorMessage('Network error. Please try again');
    }
  }

  return (
    <form className="box" onSubmit={submitForm}>
      <div className="box-container">
        <div className="input-wrapper">
          <input
            className="input-field"
            placeholder=" "
            type="email"
            name="userEmail"
            id="userEmail"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <label className="input-label" htmlFor="userEmail">Email</label>
        </div>
        <div className="input-wrapper">
          <input
            className="input-field"
            placeholder=" "
            pattern="^(?!\s*$).{10,}"
            title="Must contain at least 10 or more characters"
            type={showPassword ? 'text' : 'password'}
            name="userPassword"
            id="userPassword"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <label className="input-label" htmlFor="userPassword">Password</label>
          <button
            type="button"
            className="input-icon-button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <img
              className="input-icon"
              alt={showPassword ? 'eye closed' : 'eye open'}
              title={showPassword ? 'Hide password' : 'Show password'}
              src={showPassword ? eyeClosed : eyeOpen}
            />
          </button>
        </div>
        <div className="form-button">
          <button type="submit">LOGIN</button>
        </div>
        <div className="forgotpassword">
          <NavLink to="/forgot-password">
            Forgot Password?
          </NavLink>
        </div>
        {!loginSuccessful && (
          <p className="error-message">{errorMessage}</p>
        )}
      </div>
    </form>
  );
}
