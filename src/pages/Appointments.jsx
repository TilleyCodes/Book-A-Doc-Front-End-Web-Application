import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { useUserJwtContext } from "../hooks/useUserJwtData";
import { FormatDate } from "../components/FormatDate";
import { FormatTime } from "../components/FormatTime";
import calendar from "../assets/calendar.png"
import "../styles/appointments.css"
import { PatientConfirmation } from "../components/patientConfirmation";
import { endpoints } from "../config/api";
import { cancelBookingById } from "../config/api";

export function Appointments() {
    const { userJwtData } = useUserJwtContext()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const hiddenStatus = ['cancelled', 'completed']
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    
    useEffect(() => {
        if (!userJwtData?.patientId) {
            setTimeout(() => setLoading(false), 1500)
            return
        }
        
        async function fetchAppointments() {
            try {
                let response = await fetch(endpoints.bookings, {
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

    function confirmCancellation(appointment) {
        if (!appointment || !appointment._id) {
            console.error('Error: Appointment ID is undefinied');
            return;
        }
        setSelectedAppointment(appointment)
        setShowConfirmation(true)
    }

    async function cancelBooking(appointment) {
        if (!appointment || !appointment._id) {
            console.error('Error: Appointment ID is undefinied');
            return;
        }

        try {
            let response = await fetch(cancelBookingById(appointment._id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userJwtData.token}`,
                },
                body: JSON.stringify({ status: 'cancelled' })
            })

            if (!response.ok) {
                throw new Error('Failed to cancel appointment')
            }

            setAppointments((prevAppointments) => 
                prevAppointments.map((appt) => 
                    appt._id === appointment._id ? { ...appt, status: 'cancelled' } : appt
            ))

        } catch (err) {
            console.error('Error cancelling appointment:', err)
        } finally {
            setShowConfirmation(false)
            setSelectedAppointment(null)
        }
    
    }

    return (
        <>
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                <div className="appointment-container">
                    {loading ? (
                        <>
                            {[...Array(1)].map((_, index) => (
                                <div key={index} className="appointment-feature">
                                    <div className="appointment-feature-details">
                                        <table className="appointment-feature-details-table">
                                            <tbody>
                                                <tr key={index}>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <td><Skeleton style={{ minWidth: "80px", width: "100%" }} height={20} /></td>
                                                </tr>
                                                <tr>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <td><Skeleton style={{ minWidth: "80px", width: "100%" }} height={20} /></td>
                                                </tr>
                                                <tr>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <td><Skeleton style={{ minWidth: "120px", width: "100%" }} height={20} /></td>
                                                </tr>
                                                <tr>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <td><Skeleton style={{ minWidth: "150px", width: "100%" }} height={20} /></td>
                                                </tr>
                                                <tr>
                                                    <th><Skeleton width="100%" height={20} /></th>
                                                    <td><Skeleton style={{ minWidth: "100px", width: "100%" }} height={20} /></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="appointment-feature-buttons">
                                            <button><Skeleton style={{ minWidth: "100px"}} height={20} /></button>
                                        </div>
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
                                            <tbody>
                                                <tr>
                                                    <th>Date:</th>
                                                    <td>{FormatDate(appointment.availabilityId.date)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Time:</th>
                                                    <td>{FormatTime(appointment.availabilityId.startTime)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Doctor:</th>
                                                    <td>{appointment.doctorId.doctorName}</td>
                                                </tr>
                                                <tr>
                                                    <th>Centre:</th>
                                                    <td>{appointment.medicalCentreId.medicalCentreName}</td>
                                                </tr>
                                                <tr>
                                                    <th>Status:</th>
                                                    <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="appointment-feature-buttons">
                                            {!hiddenStatus.includes(appointment.status.trim().toLowerCase()) && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmCancellation(appointment)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>  
                            ))
                        )
                    )}
                </div>
                {showConfirmation && (
                    <PatientConfirmation 
                        selectedAppointment={selectedAppointment}
                        onClose={() => setShowConfirmation(false)} 
                        onConfirm={cancelBooking}
                        className="patient-confirmation-window" 
                    />
                )}
            </SkeletonTheme>
        </>
    )
}