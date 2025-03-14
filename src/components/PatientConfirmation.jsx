import "../styles/patientConfirmation.css";

export function PatientConfirmation({ selectedAppointment, onClose, onConfirm }) {
    return (
        <>
            <div className="confirmation-overlay" onClick={onClose}></div>

            <div className="confirmation-container">
                <div className="confirmation-text">
                    Are you sure you want to cancel your appointment?
                </div>
                <div className="confirmation-buttons">
                    <button type="button" onClick={() => onConfirm(selectedAppointment)}>Yes</button>
                    <button type="button" onClick={onClose}>No</button>
                </div>
            </div>
        </>
    );
};