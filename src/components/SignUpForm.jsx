// Imports
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomInput } from "./CustomInput";
import "../styles/reactDatePicker.css";
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";
import { Link } from "react-router";
import { endpoints } from "../config/api";

// Main function
export function SignUpForm() {

    // Define hooks
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [dateError, setDateError] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successfulSignup, setSuccessfulSignup] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    function handleDateChange(date) {
        if (!date) {
            setDateError("Date of birth is required");
            return;
        };
        if (date > today) {
            setDateError("Date cannot be in the future");
        } else if (date > minAgeDate) {
            setDateError("You must be at least 18 years old");
        } else {
            setDateError("");
        };
        setDateOfBirth(date);
    };
    
    // onSubmit event handler
    async function submitForm(event) {
        event.preventDefault();

        // Post function to API
        let targetUrl = endpoints.patients;

        let bodyDataToSend = JSON.stringify({
            firstName,
            lastName,
            email, 
            dateOfBirth,
            address: { street, city },
            phoneNumber,
            password,
        });

        try {
            const response = await fetch(
                targetUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: bodyDataToSend
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setSuccessfulSignup(false);
                setErrorMessage("Email already exists");
                console.log(data.message);
                return;
            };
            console.log("Success:", response);
            setSuccessfulSignup(true);

        } catch (err) {
            console.error("Error:", err);
            alert(err.message);
        };

    };

    return (
        <>
            <form className="box" onSubmit={(event) => submitForm(event)}>
                <div className="box-container">
                    <div className="input-wrapper">
                        <input 
                            type="email" 
                            className="input-field"
                            placeholder=" "
                            name="patientEmail"
                            id="patientEmail"
                            required
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value)
                            }}
                        />
                        <label className="input-label" htmlFor="patientEmail">Email</label>
                    </div>
                    {!successfulSignup && (
                        <p className="sign-in-error">{errorMessage}</p>
                    )}
                    <div className="name-container">
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                className="input-field"
                                placeholder=" "
                                name="patientFirstName"
                                id="patientFirstName"
                                required
                                value={firstName}
                                onChange={(event) => {
                                    setFirstName(event.target.value)
                                }}
                            />
                            <label className="input-label" htmlFor="patientFirstName">First Name</label>
                        </div>
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                className="input-field"
                                placeholder=" "
                                name="patientLastName"
                                id="patientLastName"
                                required
                                value={lastName}
                                onChange={(event) => {
                                    setLastName(event.target.value)
                                }}
                            />
                            <label className="input-label" htmlFor="patientLastName">Last Name</label>
                        </div>
                    </div>
                    <div>
                        <DatePicker
                            id="patientDateOfBirth"
                            selected={dateOfBirth}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            required
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            yearDropdownItemNumber={100}
                            scrollableYearDropdown
                            placeholderText=" "
                            customInput={
                                <CustomInput
                                    id="patientDateOfBirth" 
                                    labelText="Date of Birth"
                                />
                            }
                        />
                        {dateError && (
                            <p className="sign-in-error">{dateError}</p>
                        )}
                    </div>  
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="input-field"
                            placeholder=" "
                            name="address-street"
                            id="address-street"
                            required
                            value={street}
                            onChange={(event) => {
                                setStreet(event.target.value)
                            }}
                        />
                        <label className="input-label" htmlFor="address-street">Street</label>
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="input-field"
                            placeholder=" "
                            name="address-city"
                            id="address-city"
                            value={city}
                            onChange={(event) => {
                                setCity(event.target.value)
                            }}
                        />
                        <label className="input-label" htmlFor="address-city">City</label>
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type="tel" 
                            className="input-field"
                            placeholder=" "
                            name="phoneNumber"
                            id="phoneNumber"
                            required
                            value={phoneNumber}
                            onChange={(event) => {
                                setPhoneNumber(event.target.value)
                            }}
                        />
                        <label className="input-label" htmlFor="phoneNumber">Phone Number</label>
                    </div>
                    <div className="input-wrapper">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="input-field"
                            placeholder=" "
                            name="password"
                            id="password"
                            required
                            pattern="^(?!\s*$).{10,}"
                            title="Must contain at least 10 or more characters"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                            }}
                        />
                        <label className="input-label" htmlFor="password">Password</label>
                        <img
                            className="input-icon"
                            alt={showPassword ? "eye closed" : "eye open"}
                            title={showPassword ? "Hide password" : "Show password"}
                            src={showPassword ? eyeClosed : eyeOpen }
                            onClick={() => setShowPassword(prev => !prev)}
                            style={{cursor: "pointer"}} 
                        />
                    </div>
                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            name="acknowledge"
                            id="acknowledge"
                            required
                        />
                        <label htmlFor="acknowledge">
                            I agree to the <Link to={"/termsandconditions"} target="_blank" className="inline-link">Terms & Conditions</Link>, and <Link to={"/privacy"} target="_blank" className="inline-link">Privacy Policy</Link>.
                        </label>  
                    </div>
                    <div className="form-button">
                        <button type="submit">SIGN UP</button>
                    </div> 
                {successfulSignup && (
                    <p className="success-message">Success! Login <Link className="inline-link" id="success-inline-link" to={"/login"}>HERE</Link></p>
                )}
                </div>
            </form>
        </>
    );

};

