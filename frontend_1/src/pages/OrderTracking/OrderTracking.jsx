import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderTracking.css";
import { StoreContext } from "../../context/StoreContext";
import { getOrderTrackingById } from "../../services/orderTrackingService";
import EstimatedDeliveryCard from "../../components/OrderTracking/EstimatedDeliveryCard";
import TrackingTimeline from "../../components/OrderTracking/TrackingTimeline";
import DeliveryPartnerCard from "../../components/OrderTracking/DeliveryPartnerCard";
import OrderStatusSection from "../../components/OrderTracking/OrderStatusSection";
import MapPlaceholder from "../../components/OrderTracking/MapPlaceholder";

const OrderTracking = () => {
  const { id } = useParams();
  const { BACKEND_URL } = useContext(StoreContext);
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchTrackingDetails = async () => {
    try {
      const response = await getOrderTrackingById(BACKEND_URL, id);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to fetch tracking details");
      }

      setOrderData(response.data);
      setError("");
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to fetch tracking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchTrackingDetails();

    const intervalId = setInterval(fetchTrackingDetails, 8000);
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    if (orderData?.orderStatus !== "DELIVERED") {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
      return;
    }

    redirectTimerRef.current = setTimeout(() => {
      navigate("/");
    }, 3500);

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [navigate, orderData?.orderStatus]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border ots-primary-text" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger border-0 shadow-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page py-4 py-md-5">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Order Status</h2>
          <p className="text-secondary mb-0">Live updates for your order</p>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 ots-live-strip">
          <span className="badge rounded-pill ots-live-badge">
            <span className="ots-live-dot" /> Live tracking
          </span>
          <span className="text-secondary small">Updated {lastUpdated || "just now"}</span>
        </div>

        {orderData?.orderStatus === "DELIVERED" ? (
          <div className="alert alert-success border-0 shadow-sm mb-4">
            Delivered successfully. Redirecting you to home page...
          </div>
        ) : null}

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <EstimatedDeliveryCard
              estimatedDeliveryTime={orderData?.estimatedDeliveryTime}
              orderStatus={orderData?.orderStatus}
            />
          </div>
          <div className="col-12 col-lg-6">
            <MapPlaceholder
              orderStatus={orderData?.orderStatus}
              deliveryAddress={orderData?.deliveryAddress}
            />
          </div>

          <div className="col-12 col-lg-7">
            <TrackingTimeline currentStatus={orderData?.orderStatus} />
          </div>
          <div className="col-12 col-lg-5 d-flex flex-column gap-4">
            <DeliveryPartnerCard
              name={orderData?.deliveryPartnerName}
              phone={orderData?.deliveryPartnerPhone}
            />
            <OrderStatusSection
              orderId={orderData?.orderId}
              orderStatus={orderData?.orderStatus}
              totalPrice={orderData?.totalPrice}
              orderItems={orderData?.orderItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
