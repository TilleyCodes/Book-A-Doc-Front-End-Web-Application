// Imports

import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { CustomInput } from "./CustomInput"
import "../styles/reactDatePicker.css"
import eyeOpen from "../assets/eye-open.svg"
import eyeClosed from "../assets/eye-closed.svg"
import { Link } from "react-router"

// Main function
export function SignUpForm() {
    // Define hooks
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    
    // onSubmit event handler
    async function submitForm(event) {
        event.preventDefault()
        // Post function to API
        let targetUrl = 'http://localhost:3000/patients/???'

        let bodyDataToSend = JSON.stringify({
            email: email, 
            fname: firstName,
            lname: lastName,
            dob: dateOfBirth,
            address: {
                street: street,
                city: city,
            },
            phone: phoneNumber,
            password: password
        })

        let response = await fetch(
            targetUrl,
            {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: bodyDataToSend
            }
        )

        let bodyData = await response.json()

    }

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
                            required="true"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value)
                            }}
                        />
                        <label className="input-label" htmlFor="patientEmail">Email</label>
                    </div>
                    <div className="name-container">
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                className="input-field"
                                placeholder=" "
                                name="patientFirstName"
                                id="patientFirstName"
                                required="true"
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
                                required="true"
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
                            onChange={(date) => setDateOfBirth(date)}
                            dateFormat="dd/MM/yyyy"
                            required="true"
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
                    </div>  
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="input-field"
                            placeholder=" "
                            name="address-street"
                            id="address-street"
                            required="true"
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
                            required="true"
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
                            required="true"
                            pattern=".{10,}"
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
                            required="true"
                        />
                        <label htmlFor="acknowledge">
                            I agree to the <Link to={'/termsandconditions'} target="_blank" className="inline-link">Terms & Conditions</Link>, and <Link to={'/privacy'} target="_blank" className="inline-link">Privacy Policy</Link>.
                        </label>  
                    </div>
                    <div className="form-button">
                        <button type="submit">SIGN UP</button>
                    </div> 
                </div>
            </form>
            
            {/* Post sign-up screen directing them to sign in */}
        </>
    )

}

