import { useState, useEffect } from "react";

export function useMedicalCentres() {
  const [medicalCentres, setMedicalCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchMedicalCentres = async () => {
      try {
        setLoading(true);
        console.log("Fetching medical centres...");
        
        // Using the proxy configured in vite.config.js
        const response = await fetch("/api/medicalCentres");
        
        console.log("Response received:", response.status, response.statusText);
        
        if (!response.ok) {
          console.error("Response not OK:", response.status, response.statusText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Data received:", data); // Log the data
        setMedicalCentres(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error details:", err); // error logging
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalCentres();
  }, [refetchTrigger]);

  // Function to manually trigger a refetch
  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { medicalCentres, loading, error, refetch };
}