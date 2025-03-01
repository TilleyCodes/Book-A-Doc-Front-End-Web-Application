import { useState } from "react";
import { useUserJwtContext } from "../hooks/useUserJwtData";

export function LoginForm() {
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    // ERROR in dev tools console for useUserJwtContext so it's commented out for now
    // let [userJwtData, setUserJwtData] = useUserJwtContext

    async function submitForm(event) {
        event.preventDefault()

        console.log(`About to send a login request containing ${email}, ${password} to the API`)

        // To be updated once API has been deployed
        let targetUrl = ''

        let bodyDataToSend = JSON.stringify({email: email, password: password})
        console.log(bodyDataToSend)

        let response = await fetch(
            targetUrl,
            {
                method: 'POST',
                header: {
                    'Content-Type':'application/json'
                },
                body: bodyDataToSend
            }
        )

        let bodyData = await response.json()
        console.log('Body data received from API is:\n' + JSON.stringify(bodyData, null, 4))

        setUserJwtData({
            accessToken: bodyData.accessToken,
            refreshToken: bodyData.refreshToken
        })
        console.log('UserJwtData is now set to:\n' + JSON.stringify(userJwtData, null, 4))
    }

    return (
        <form onSubmit={(event) => submitForm(event)}>
            <label htmlFor="userEmail">Email</label>
            <input
                type="email"
                name="userEmail"
                id="userEmail"
                value={email}
                onChange={(event) => {
                    setEmail(event.target.value)
                }}
            />

            <label htmlFor="userPassword">Password</label>
            <input
                type="password"
                name="userPassword"
                id="userPassword"
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value)
                }}
            />

            <button type="submit">LOGIN</button>
        </form>
    )
}