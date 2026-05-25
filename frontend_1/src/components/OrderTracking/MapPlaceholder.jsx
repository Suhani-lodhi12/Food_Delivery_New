import React from "react";

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d946c116c2b19c01b2641f5549cc169e277466d7
const buildAddressLabel = (deliveryAddress) => {
  if (!deliveryAddress) return "Your delivery location";

  const addressParts = [
    deliveryAddress.street,
    deliveryAddress.city,
    deliveryAddress.state,
    deliveryAddress.zipCode,
    deliveryAddress.country,
  ]
    .filter(Boolean)
    .map((value) => value.trim());

  return addressParts.length > 0 ? addressParts.join(", ") : "Your delivery location";
};

const MapPlaceholder = ({ orderStatus, deliveryAddress }) => {
  const destinationLabel = buildAddressLabel(deliveryAddress);
  const statusLabel = orderStatus === "DELIVERED" ? "Delivered" : "Live location";
  const mapQuery = encodeURIComponent(destinationLabel);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
<<<<<<< HEAD
=======

  return (
    <div className="card border-0 shadow-sm ots-map-card">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <p className="mb-1 text-uppercase small ots-map-label">Delivery location</p>
            <h4 className="mb-1 fw-bold">{statusLabel}</h4>
            <p className="mb-0 text-secondary ots-map-address">{destinationLabel}</p>
          </div>
          <span className="badge rounded-pill ots-badge-soft px-3 py-2">{orderStatus || "PROCESSING"}</span>
        </div>

        <div className="ots-map-frame-wrap mb-3">
          <iframe
            title="Delivery map"
            className="ots-map-frame"
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="ots-map-overlay">
            <div className="ots-map-pin">
              <i className="fa-solid fa-location-dot" />
            </div>
            <div>
              <p className="mb-1 small text-white-50 text-uppercase">Pinned location</p>
              <h6 className="mb-0 text-white">Tap to explore the map</h6>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="text-secondary small">
            <i className="fa-solid fa-circle-info me-2 ots-primary-text" />
            This map opens the exact delivery address you entered.
          </div>
          <a
            className="btn btn-sm btn-outline-warning ots-map-link"
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in Maps
          </a>
=======
const MapPlaceholder = ({ orderStatus }) => {
  const riderText = orderStatus === "DELIVERED" ? "Delivered to your location" : "Courier moving toward you";
  const statusLabel = orderStatus === "DELIVERED" ? "Delivered" : "Rider moving";
>>>>>>> d946c116c2b19c01b2641f5549cc169e277466d7

  return (
    <div className="card border-0 shadow-sm ots-map-card">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <p className="mb-1 text-uppercase small ots-map-label">Delivery location</p>
            <h4 className="mb-1 fw-bold">{statusLabel}</h4>
            <p className="mb-0 text-secondary ots-map-address">{destinationLabel}</p>
          </div>
          <span className="badge rounded-pill ots-badge-soft px-3 py-2">{orderStatus || "PROCESSING"}</span>
        </div>

        <div className="ots-map-frame-wrap mb-3">
          <iframe
            title="Delivery map"
            className="ots-map-frame"
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="ots-map-overlay">
            <div className="ots-map-pin">
              <i className="fa-solid fa-location-dot" />
            </div>
            <div>
              <p className="mb-1 small text-white-50 text-uppercase">Pinned location</p>
              <h6 className="mb-0 text-white">Tap to explore the map</h6>
            </div>
          </div>
        </div>
<<<<<<< HEAD

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="text-secondary small">
            <i className="fa-solid fa-circle-info me-2 ots-primary-text" />
            This map opens the exact delivery address you entered.
          </div>
          <a
            className="btn btn-sm btn-outline-warning ots-map-link"
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in Maps
          </a>
=======
        <div>
          <p className="mb-1 text-uppercase small ots-map-label">Courier location</p>
          <h5 className="mb-0">{riderText}</h5>
>>>>>>> 75c49a666787c79357325f140732950e0709225f
>>>>>>> d946c116c2b19c01b2641f5549cc169e277466d7
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
