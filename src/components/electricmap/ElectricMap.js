import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function ElectricMap() {
  return (
    <MapContainer
      center={[-1.2921, 36.8219]} // Nairobi coords
      zoom={13}
      style={{ height: '250px', width: '100%', borderRadius: '10px' }}
      scrollWheelZoom={false}
      className='electric-map'
    >
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        attribution='© OpenStreetMap contributors'
      />
      <Marker position={[-1.29441, 36.75606]}>
        <Popup>
          DYnaTronics HQ <br /> Nairobi, Kenya
        </Popup>
      </Marker>
    </MapContainer>
  );
}
