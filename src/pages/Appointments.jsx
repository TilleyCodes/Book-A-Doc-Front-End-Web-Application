import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { useUserJwtContext } from "../hooks/useUserJwtData";
import { FormatDate } from "../components/FormatDate";
import { FormatTime } from "../components/FormatTime";
import calendar from "../assets/calendar.png"
import "../styles/appointments.css"

export function Appointments() {
    const { userJwtData } = useUserJwtContext()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userJwtData?.patientId) {
            setTimeout(() => setLoading(false), 1500)
            return
        }

        async function fetchAppointments() {
            try {
                let response = await fetch(' https://book-a-doc-back-end-web-application.onrender.com/bookings', {
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
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [userJwtData?.patientId, userJwtData.token])

    return (
        <>
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                <div className="appointment-container">
                    {loading ? (
                        <>
                            {[...Array(1)].map((_, index) => (
                                <div key={index} className="appointment-feature">
                                    <div className="appointment-feature-image">
                                        <Skeleton width={80} height={80} />
                                    </div>
                                    <div className="appointment-feature-details">
                                        <table className="appointment-feature-details-table">
                                            <thead>
                                                <tr>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key={index}>
                                                <td><Skeleton style={{ minWidth: "80px", width: "100%" }} height={20} /></td>
                                                <td><Skeleton style={{ minWidth: "80px", width: "100%" }} height={20} /></td>
                                                <td><Skeleton style={{ minWidth: "120px", width: "100%" }} height={20} /></td>
                                                <td><Skeleton style={{ minWidth: "150px", width: "100%" }} height={20} /></td>
                                                <td><Skeleton style={{ minWidth: "100px", width: "100%" }} height={20} /></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        appointments.length === 0 ? (
                            <p>No appointments found</p>
                        ) : (
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
                        )
                    )}
                </div>
            </SkeletonTheme>
        </>
    )
}