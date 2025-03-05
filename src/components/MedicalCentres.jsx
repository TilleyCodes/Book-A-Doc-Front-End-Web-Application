// import { useState, useRef } from "react";
// import "../styles/medicalCentres.css";
// // import { DoctorList } from "./DoctorList";
// import { useUserJwtContext } from "../hooks/useUserJwtData";
// import { useNavigate } from "react-router";
// import { useMedicalCentres } from "../hooks/useMedicalCentres";
// import hospitalIcon from "../assets/icons8-hospital-3-50.png"; 
// import upArrowIcon from "../assets/up-arrow.png";

// export function MedicalCentres() {
//   const { medicalCentres, loading, error } = useMedicalCentres();
//   const [selectedCentre, setSelectedCentre] = useState(null);
//   const [showDoctorList, setShowDoctorList] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { userJwtData } = useUserJwtContext();
//   const navigate = useNavigate();
//   const isLoggedIn = Boolean(userJwtData && userJwtData.token);
//   const topRef = useRef(null);

//   const handleCentreClick = (centre) => {
//     setSelectedCentre(selectedCentre === centre ? null : centre);
//   };

//   const handleViewDoctors = (e) => {
//     e.stopPropagation();
//     setShowDoctorList(true);
//   };

//   const handleCloseDoctorList = () => {
//     setShowDoctorList(false);
//   };
  
//   const scrollToTop = () => {
//     topRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

    
//     // Navigate to booking page with the medical centre ID as a parameter
//     if (selectedCentre) {
//       navigate(`/appointments/book?centreId=${selectedCentre._id}`);
//     }
//   };

//   // Filter medical centres based on search query
//   const filteredCentres = medicalCentres.filter((centre) => {
//     const searchTerms = searchQuery.toLowerCase();
//     return (
//       centre.medicalCentreName.toLowerCase().includes(searchTerms) ||
//       centre.address.city.toLowerCase().includes(searchTerms) ||
//       centre.address.street.toLowerCase().includes(searchTerms)
//     );
//   });
     
//       <div className="search-section">
//         <span className="search-icon">🔍</span>
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button className="search-button">→</button>
//       </div>
      
//       <div className="centres-grid">
//         {filteredCentres.map((centre) => (
//           <div 
//             key={centre._id}
//             className={`centre-card ${selectedCentre === centre ? "centre-card-selected" : ""}`}
//             onClick={() => handleCentreClick(centre)}
//           >
//             <div className="centre-icon">
//               <img src={hospitalIcon} alt="Medical Centre" width="40" height="40" />
//             </div>
//             <div className="centre-content">
//               <h2 className="centre-name">{centre.medicalCentreName}</h2>
//               <div className="centre-details">
//                 <p className="centre-info-line">
//                   <span className="detail-label">Hours:</span> {centre.operatingHours}
//                 </p>
//                 <p className="centre-info-line">
//                   <span className="detail-label">Address:</span> {centre.address.street}, {centre.address.city}
//                 </p>
//                 <p className="centre-info-line">
//                   <span className="detail-label">Contact:</span> {centre.contacts.phone}
//                 </p>
//               </div>
              
//               {selectedCentre === centre && (
//                 <div className="centre-actions">
//                   <button 
//                     className="btn view-doctors-btn"
//                     onClick={handleViewDoctors}
//                   >
//                     View Doctors
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {filteredCentres.length === 0 && !loading && (
//         <div className="no-centres-message">
//           No medical centres found. Please try another search.
//         </div>
//       )}
      
//         <div className="back-to-top" onClick={scrollToTop}>
//           back to top <img src={upArrowIcon} alt="Up Arrow" className="up-arrow-icon" />
//         </div>
      
//       {showDoctorList && selectedCentre && (
//         <DoctorList 
//           medicalCentreId={selectedCentre._id} 
//           onClose={handleCloseDoctorList}
//         />
//       )}
//     </div>
//   );