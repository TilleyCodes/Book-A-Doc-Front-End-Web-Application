// Imports

import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { CustomInput } from "./CustomInput"
import "../styles/reactDatePicker.css"

// Main function
export function SignUpForm() {
    // Define hooks
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    
    // onSubmit event handler
    async function submitForm(event) {
        event.preventDefault()
        // Post function to API

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
                                value={lastName}
                                onChange={(event) => {
                                    setLastName(event.target.value)
                                }}
                            />
                            <label className="input-label" htmlFor="patientLastName">Last Name</label>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        {/* <input 
                            type="date" 
                            className="input-field"
                            placeholder=" "
                            name="patientDateOfBirth"
                            id="patientDateOfBirth"
                            value={dateOfBirth}
                            onChange={(event) => {
                                setDateOfBirth(event.target.value)
                            }}
                        />
                        <label className="input-label" htmlFor="patientDateOfBirth">Date of Birth</label> */}
                        <DatePicker
                            id="patientDateOfBirth"
                            selected={dateOfBirth}
                            onChange={(date) => setDateOfBirth(date)}
                            dateFormat="dd/MM/yyyy"
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
                </div>
                {/* first name
                last name
                DOB - date picker?
                address
                Phone number
                password / validation and styling / red outline until correct
                Tick box for acknowledgement / required
                sign up button */}

            </form>
            
            {/* Post sign-up screen directing them to sign in */}
        </>
    )

}

