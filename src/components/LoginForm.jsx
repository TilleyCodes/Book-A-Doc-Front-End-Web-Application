import { useEffect, useState } from "react";
import { useUserJwtContext } from "../hooks/useUserJwtData";
import "../styles/login.css"
import eyeOpen from "../assets/eye-open.svg"
import eyeClosed from "../assets/eye-closed.svg"

export function LoginForm() {
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [showPassword, setShowPassword] = useState(false)

    const { userJwtData, setUserJwtData } = useUserJwtContext()

    useEffect(() => {
        console.log('UserJwtData updated:', userJwtData)
    }, [userJwtData])

    async function submitForm(event) {
        event.preventDefault()

        console.log(`About to send a login request containing ${email}, ${password} to the API`)

        // To be updated once API has been deployed
        let targetUrl = 'http://localhost:3000/patients/login'

        let bodyDataToSend = JSON.stringify({email: email, password: password})
        console.log(bodyDataToSend)

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
        console.log('Body data received from API is:\n' + JSON.stringify(bodyData, null, 4))

        setUserJwtData({
            token: bodyData.token,
            patient: bodyData.patient
        })
        // console.log('UserJwtData is now set to:\n' + JSON.stringify(userJwtData, null, 4))

        
    }

    return (
        <form className="box" onSubmit={(event) => submitForm(event)}>
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
                            setEmail(event.target.value)
                        }}
                    />
                    <label className="input-label" htmlFor="userEmail">Email</label>
                </div>
                <div className="input-wrapper">
                    <input
                        className="input-field"
                        placeholder=" "
                        type={showPassword ? "text" : "password"}
                        name="userPassword"
                        id="userPassword"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}
                    />
                    <label className="input-label" htmlFor="userPassword">Password</label>
                    <img
                        className="input-icon"
                        alt={showPassword ? "eye closed" : "eye open"}
                        title={showPassword ? "Hide password" : "Show password"}
                        src={showPassword ? eyeClosed : eyeOpen }
                        onClick={() => setShowPassword(prev => !prev)}
                        style={{cursor: "pointer"}} 
                    />
                </div>
                <div className="form-button">
                    <button type="submit">LOGIN</button>
                </div>
                <div className="forgotpassword">
                    Forgot Password?
                </div>  
            </div>
        </form>
    )
}