import React, { useState, useRef } from "react";
import { Key } from "../../utils/envAccess";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  MarkerF,
} from "@react-google-maps/api";
import { useEffect } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "250px",
};

const defaultZoom = 15;
const libraries = ["geometry", "places", "drawing"];

function Map({ latitude, longitude, setFieldValue }) {
  console.log("lat ", latitude);
  console.log("long ", longitude);
  const [markers, setMarkers] = useState();
  const [center, setCenter] = useState();
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  const setFormValue = (lat, lng) => {
    setFieldValue("latitude", lat);
    setFieldValue("longitude", lng);
  };

  const setCenterValue = (lat, lng) => {
    setCenter({
      lat: lat,
      lng: lng,
      info: null,
    });
  };

  const setMarkersValue = (lat, lng) => {
    setMarkers({
      lat: lat,
      lng: lng,
      info: null,
    });
  };

  useEffect(() => {
    setCenterValue(latitude, longitude);
    setMarkersValue(latitude, longitude);
  }, [latitude, longitude]);

  const handleMapClick = (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      info: null,
    };
    //setMarkers([...markers, newMarker]); //for setting up multiple Markers;
    setCenter({
      lat: newMarker.lat,
      lng: newMarker.lng,
    });
    setMarkers(newMarker);

    setFormValue(newMarker.lat, newMarker.lng); // setting formik Value
  };

  //input serach
  const handlePlaceSelect = (place) => {
    if (!place || !place.formatted_address) {
      alert("Empty field");
      setMarkers(null);
    } else {
      const newMarker = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        info: null,
      };
      setCenter({
        lat: newMarker?.lat,
        lng: newMarker?.lng,
      });
      setMarkers(newMarker);

      setFormValue(newMarker.lat, newMarker.lng); // setting formik Value
    }
  };

  return (
    <LoadScript googleMapsApiKey={Key} libraries={libraries}>
      <div>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={() =>
            handlePlaceSelect(autocompleteRef.current.getPlace())
          }
        >
          <input
            ref={mapRef}
            type="text"
            placeholder="Search for a location"
            className="mb-1"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `100%`,
              height: `42px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={defaultZoom}
          onClick={handleMapClick}
          streetViewControl={false}
          fullscreenControl={false}
          mapTypeControl={false}
        >
          {/* {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))} */}
          <MarkerF position={{ lat: markers?.lat, lng: markers?.lng }} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default Map;
