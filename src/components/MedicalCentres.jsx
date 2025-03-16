import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import '../styles/medicalCentres.css';
import { DoctorList } from './DoctorList';
import { useMedicalCentres } from '../hooks/useMedicalCentres';
import medicalIcon from '../assets/medical-clinic.png';
import searchIcon from '../assets/search-icon.png';

export function MedicalCentres() {
  const { medicalCentres, loading, error } = useMedicalCentres();
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [centreFilter, setCentreFilter] = useState('all');
  const [exactSearch, setExactSearch] = useState(false);
  const topRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const exact = params.get('exact') === 'true';
    setSearchQuery(search);
    setAppliedSearch(search);
    setExactSearch(exact);
  }, [location.search]);

  useEffect(() => {
    // search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleCentreClick = (centre) => {
    setSelectedCentre(selectedCentre === centre ? null : centre);
  };

  const handleViewDoctors = (e, centre) => {
    e.stopPropagation();
    setSelectedCentre(centre);
    setShowDoctorList(true);
  };

  const handleCloseDoctorList = () => {
    setShowDoctorList(false);
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    // default to show all medical centres when search is empty
    if (value === '') {
      setAppliedSearch('');
    }
  };

  // Get cities for the filter
  const cities = [...new Set(medicalCentres.map((centre) => centre.address.city))];

  // Filter medical centres based on search query and city filter
  const filteredCentres = medicalCentres.filter((centre) => {
    let matchesSearch = true;
    if (appliedSearch.trim() !== '') {
      if (exactSearch) {
        matchesSearch = (
          centre.medicalCentreName &&
          centre.medicalCentreName.trim().toLowerCase() === appliedSearch.trim().toLowerCase()
        );
      } else {
        matchesSearch = (
          centre.medicalCentreName.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          centre.address.city.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          centre.address.street.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
    }
    const matchesCity = centreFilter === 'all' || centre.address.city === centreFilter;
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return <div className="loading-container">Loading medical centres...</div>;
  }

  return (
    <div className="medical-centres-container" ref={topRef}>
      {error && (
        <div className="error-container">
          {'Error: '}
          {error}
        </div>
      )}

      <form className="search-section" onSubmit={handleSearch}>
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Search by name, address or city..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="search-button">→</button>
      </form>

      <div className="filter-section">
        <label htmlFor="city-filter">
          {'Filter by city: '}
        </label>
        <select
          id="city-filter"
          value={centreFilter}
          onChange={(e) => setCentreFilter(e.target.value)}
          className="city-filter"
        >
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="results-count">
        {filteredCentres.length}
        {' '}
        {filteredCentres.length === 1 ? 'centre' : 'centres'}
        {' found'}
      </div>

      <div className="centres-grid">
        {filteredCentres.map((centre) => (
          <div
            key={centre._id}
            className={`centre-card ${selectedCentre === centre ? 'centre-card-selected' : ''}`}
            onClick={() => handleCentreClick(centre)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCentreClick(centre);
              }
            }}
          >
            <div className="centre-icon">
              <img src={medicalIcon} alt="Medical Centre" className="mc-feature-icon" />
            </div>
            <div className="centre-content">
              <h2 className="centre-name">{centre.medicalCentreName}</h2>
              <div className="centre-details">
                <p className="centre-info-line">
                  <span className="detail-label">
                    {'Hours: '}
                  </span>
                  {centre.operatingHours}
                </p>
                <p className="centre-info-line">
                  <span className="detail-label">
                    {'Address: '}
                  </span>
                  {centre.address.street}
                  {', '}
                  {centre.address.city}
                </p>
                <p className="centre-info-line">
                  <span className="detail-label">
                    {'Contact: '}
                  </span>
                  {centre.contacts.phone}
                </p>
                <p className="centre-info-line">
                  <span className="detail-label">
                    {'Email: '}
                  </span>
                  {centre.contacts.email}
                </p>
              </div>

              <div className="centre-actions">
                <button
                  type="button"
                  className="btn view-doctors-btn"
                  onClick={(e) => handleViewDoctors(e, centre)}
                >
                  View Doctors
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCentres.length === 0 && !loading && (
        <div className="no-centres-message">
          No medical centres found. Please try another search.
        </div>
      )}

      <button
        type="button"
        className="back-to-top"
        onClick={scrollToTop}
      >
        back to top ↑
      </button>

      {showDoctorList && selectedCentre && (
        <DoctorList
          medicalCentreId={selectedCentre._id}
          onClose={handleCloseDoctorList}
        />
      )}
    </div>
  );
}
