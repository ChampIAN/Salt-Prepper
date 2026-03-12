"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function MapUpdater({ selectedPark }: { selectedPark: any }) {
    const map = useMap();
    useEffect(() => {
        if (selectedPark && selectedPark.lat && selectedPark.lng) {
            map.flyTo([selectedPark.lat, selectedPark.lng], 11, { animate: true, duration: 1.5 });
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

function RVMarker({ park, selectedPark, setSelectedPark }: any) {
    const isSelected = selectedPark?.id === park.id;
    const markerRef = React.useRef<any>(null);

    useEffect(() => {
        if (isSelected && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [isSelected, selectedPark]);

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
    rvParks: any[],
    selectedPark: any,
    setSelectedPark: (park: any) => void
}) {
    return (
        <MapContainer
            center={[selectedPark?.lat || 39.8283, selectedPark?.lng || -98.5795]}
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
