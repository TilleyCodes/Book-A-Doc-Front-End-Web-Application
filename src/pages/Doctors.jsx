import React, { useEffect, useState } from "react";

export function Doctors() {
    const [doctors, setDoctors] = useState([])
 

    useEffect(() => {
        async function fetchDoctors() {
            const res = await fetch('http://localhost:3000/doctors')
            const bodyData = await res.json()
            setDoctors(bodyData)
        }
        fetchDoctors()
    }, [])

    return (
        <>
            <h2>List of Doctors</h2>
            <ul>
                {doctors.map((doctor, index) => (
                    <li key={index}>
                        {doctor.doctorName} ({doctor.specialtyId.specialtyName})
                    </li>
                ))}
            </ul>
        </>
    )
}