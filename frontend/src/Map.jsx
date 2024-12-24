import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import axios from "axios";

function MapComponent() {
    const [userLocation, setuserLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        const success = (pos) => {
            setuserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        };

        const error = (err) => {
            console.error("Error fetching location:", err);
            alert("Failed to fetch location. Please enable location services.");
        };

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    }, []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });


    if (!isLoaded) return <div>Loading...</div>;

    const mapContainerStyle = {
        width: '100vw',
        height: '100vh',
    };

    async function searchHospitals() {
        try {
            const url = `http://localhost:3000/search_hospitals/?lat=${userLocation["lat"]}&lng=${userLocation["lng"]}&radius=${1500}`;
            const response = await axios.get(url);
            // console.log(response.data.results);
            setHospitals(response.data.results);
            for (let i = 0; i < hospitals.length; i++) {
                console.log(hospitals[i]["name"]);
            }
        }
        catch (e) {
            console.log("error", e)
        }
    }

    return (
        <div>
            {userLocation ? (
                <>
                    <h2>Latitude: {userLocation.lat}</h2>
                    <h2>Longitude: {userLocation.lng}</h2>
                </>
            ) : (
                <h2>Fetching location...</h2>
            )}
            <button onClick={searchHospitals}>Fetch hospitals</button>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={userLocation}
            >
                {userLocation && isLoaded && (
                    <Marker
                        position={userLocation}
                        icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    />
                )}

                {hospitals.map((hospital) => <Marker position={hospital["geometry"]["location"]} key={hospital["name"]} />)}
            </GoogleMap>
        </div >
    );
}

export default MapComponent;
