"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

interface BranchPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationsMapProps {
  branches: BranchPin[];
  selectedId: string | null;
  onPinClick: (id: string) => void;
  className?: string;
}

const mapContainerStyle = { width: "100%", height: "100%" };
const thailandCenter = { lat: 13.7563, lng: 100.5018 };

export function LocationsMap({
  branches,
  selectedId,
  onPinClick,
  className = "",
}: LocationsMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey ?? "",
  });

  const markers = useMemo(
    () =>
      branches.map((b) => ({
        id: b.id,
        position: { lat: b.latitude, lng: b.longitude },
        name: b.name,
      })),
    [branches]
  );

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMarkerClick = useCallback(
    (id: string) => () => onPinClick(id),
    [onPinClick]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current || markers.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((m) => bounds.extend(m.position));
    if (markers.length > 1) {
      mapRef.current.fitBounds(bounds, 60);
    } else if (selectedId) {
      const m = markers.find((x) => x.id === selectedId);
      if (m) {
        mapRef.current.setCenter(m.position);
        mapRef.current.setZoom(15);
      }
    }
  }, [markers, selectedId]);

  const mapOptions = useMemo(
    () => ({
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    }),
    []
  );

  if (!apiKey) {
    return (
      <div
        className={`flex items-center justify-center bg-hertz-gray text-center ${className}`}
      >
        <div className="max-w-sm px-6">
          <p className="text-sm font-medium text-hertz-black-80">
            ตั้งค่า NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ใน .env.local เพื่อแสดงแผนที่
          </p>
          <p className="mt-2 text-xs text-hertz-black-60">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to display the map
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center bg-hertz-gray text-center ${className}`}
      >
        <p className="text-sm text-hertz-black-80">ไม่สามารถโหลดแผนที่ได้</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center bg-hertz-gray ${className}`}
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-hertz-black-60" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={thailandCenter}
        zoom={6}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.position}
            title={m.name}
            onClick={onMarkerClick(m.id)}
            zIndex={selectedId === m.id ? 1000 : 1}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
