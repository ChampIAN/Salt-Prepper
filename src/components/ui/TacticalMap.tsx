"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const isValidCoord = (val: unknown): val is number =>
    typeof val === 'number' && isFinite(val);

const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795]; // Center of US

interface Park {
    id: string | number;
    name: string;
    lat: number;
    lng: number;
    status: string;
}

function MapUpdater({ selectedPark }: { selectedPark: Park | null }) {
    const map = useMap();
    useEffect(() => {
        if (selectedPark && isValidCoord(selectedPark.lat) && isValidCoord(selectedPark.lng)) {
            try {
                // Leaflet flyTo crashes if the container has 0 dimensions (hidden on mobile)
                const size = map.getSize();
                if (size.x > 0 && size.y > 0) {
                    map.flyTo([selectedPark.lat, selectedPark.lng], 11, { animate: true, duration: 1.5 });
                } else {
                    // Container not visible yet — use instant setView instead
                    map.setView([selectedPark.lat, selectedPark.lng], 11, { animate: false });
                }
            } catch {
                // Fallback: silently set view without animation
                try {
                    map.setView([selectedPark.lat, selectedPark.lng], 11, { animate: false });
                } catch {
                    // Map not ready — ignore
                }
            }
        }
    }, [selectedPark, map]);
    return null;
}
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createPulsingIcon = (isActive: boolean) => L.divIcon({
    className: 'custom-div-icon',
    html: `
    <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${isActive ? '#10b981' : 'rgba(16, 185, 129, 0.6)'}; transform: scale(${isActive ? 1.5 : 1}); box-shadow: 0 0 ${isActive ? '20px' : '10px'} rgba(16, 185, 129, 0.8);">
    </div>
  `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
});

function RVMarker({ park, selectedPark, setSelectedPark }: { park: Park, selectedPark: Park | null, setSelectedPark: (park: Park) => void }) {
    const isSelected = selectedPark?.id === park.id;
    const markerRef = React.useRef<L.Marker>(null);

    useEffect(() => {
        if (isSelected && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [isSelected, selectedPark]);

    if (!isValidCoord(park.lat) || !isValidCoord(park.lng)) return null;

    return (
        <Marker
            ref={markerRef}
            position={[park.lat, park.lng]}
            icon={createPulsingIcon(isSelected)}
            eventHandlers={{
                click: () => setSelectedPark(park)
            }}
        >
            <Popup className="tactical-popup" autoPan={false}>
                <div className="bg-surface/90 border border-accent/50 p-4 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-text-heading mb-1">{park.name}</h3>
                    <p className="text-[8px] text-text-dim uppercase tracking-widest mb-3">RV Parks</p>
                    <div className="text-[8px] font-bold text-accent bg-accent/10 px-2 py-1 rounded border border-accent/50 inline-block">
                        STATUS: {park.status}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

export default function TacticalMap({
    rvParks,
    selectedPark,
    setSelectedPark
}: {
    rvParks: Park[],
    selectedPark: Park | null,
    setSelectedPark: (park: Park) => void
}) {
    const centerLat = isValidCoord(selectedPark?.lat) ? selectedPark!.lat : DEFAULT_CENTER[0];
    const centerLng = isValidCoord(selectedPark?.lng) ? selectedPark!.lng : DEFAULT_CENTER[1];

    return (
        <MapContainer
            center={[centerLat, centerLng]}
            zoom={11}
            style={{ height: '100%', width: '100%', background: '#000000' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapUpdater selectedPark={selectedPark} />
            {rvParks.map(park => (
                <RVMarker
                    key={park.id}
                    park={park}
                    selectedPark={selectedPark}
                    setSelectedPark={setSelectedPark}
                />
            ))}
        </MapContainer>
    );
}
