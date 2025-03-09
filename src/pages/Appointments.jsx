import React, { useEffect, useState } from "react";
import { useUserJwtContext } from "../hooks/useUserJwtData";
import { FormatDate } from "../components/FormatDate";
import { FormatTime } from "../components/FormatTime";
import calendar from "../assets/calendar.png"
import "../styles/appointments.css"

export function Appointments() {
    const { userJwtData } = useUserJwtContext()
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        if (!userJwtData?.patientId) return

        async function fetchAppointments() {
            try {
                let response = await fetch('http://localhost:3000/bookings', {
                    headers: {
                        Authorization: `Bearer ${userJwtData.token}`,
                    }
                })

                let data = await response.json()
                if (!response.ok) throw new Error(data.message || 'Failed to fetch appointments')

                let filteredData = data.filter(booking => booking.patientId._id === userJwtData.patientId)
                setAppointments(filteredData)

            } catch (err) {
                console.error('Error fetching appointments:', err)
            }
        }

        fetchAppointments()
    }, [userJwtData?.patientId, userJwtData.token])

    return (
        <>
            <div className="appointment-container">
                {appointments.length === 0 ? (<p>No appointments found</p>) : (
                    appointments.map((appointment) => (
                        <div key={appointment._id} className="appointment-feature">
                            <div className="appointment-feature-image">
                                <img src={calendar} className="calendar-image" alt="Calendar image" />
                            </div>
                            <div className="appointment-feature-details">
                                <table className="appointment-feature-details-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Doctor</th>
                                            <th>Medical Centre</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{FormatDate(appointment.availabilityId.date)}</td>
                                            <td>{FormatTime(appointment.availabilityId.startTime)}</td>
                                            <td>{appointment.doctorId.doctorName}</td>
                                            <td>{appointment.medicalCentreId.medicalCentreName}</td>
                                            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}