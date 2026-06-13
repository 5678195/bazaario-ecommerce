import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapCenterUpdater({ center }) {
  const map = useMap();
  if (center) map.setView(center, 16);
  return null;
}

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(res => res.json())
        .then(data => {
          onLocationSelect({ lat, lng, address: data.display_name });
        });
    },
  });
  return null;
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [marker, setMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);

  const handleLocationSelect = ({ lat, lng, address }) => {
    setMarker({ lat, lng });
    setAddress(address);
  };

  const handleAutoLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            setMarker({ lat, lng });
            setMapCenter([lat, lng]);
            setAddress(data.display_name);
            setLocating(false);
          });
      },
      () => {
        setError('Location access denied. Please allow location or select manually.');
        setLocating(false);
      }
    );
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await ordersApi.post('/orders', {
        items: cart.items,
        total: cart.total,
        shipping_address: address,
        lat: marker?.lat,
        lng: marker?.lng,
      });
      await clearCart();
      navigate('/orders', { state: { newOrder: data.order } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#1B1F3B] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Checkout
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Order Summary
        </h2>
        <div className="space-y-3">
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.product_name} x {item.quantity}</span>
              <span className="font-medium">{formatPrice(item.product_price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold text-[#1B1F3B]">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleOrder} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Select Delivery Location
          </h2>
          <button
            type="button"
            onClick={handleAutoLocation}
            disabled={locating}
            className="bg-[#1B1F3B] text-white text-sm px-4 py-2 rounded-md hover:bg-[#2a2f55] transition-colors disabled:opacity-50"
          >
            {locating ? 'Locating...' : 'Use My Location'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Map pe click karo ya "Use My Location" button dabao</p>

        <div className="rounded-lg overflow-hidden border border-gray-200 mb-4" style={{ height: '300px' }}>
          <MapContainer center={[33.6844, 73.0479]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <LocationPicker onLocationSelect={handleLocationSelect} />
            {mapCenter && <MapCenterUpdater center={mapCenter} />}
            {marker && <Marker position={[marker.lat, marker.lng]} />}
          </MapContainer>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
          <textarea
            required
            rows={3}
            placeholder="Map pe click karo ya Use My Location dabao..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !address}
          className="w-full bg-[#FF8C42] text-[#1B1F3B] py-3 rounded-md font-semibold hover:bg-orange-400 transition-colors disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
