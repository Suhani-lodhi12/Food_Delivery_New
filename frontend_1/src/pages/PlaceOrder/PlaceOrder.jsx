import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const {
    BACKEND_URL,
    USER_ID,
    food_list,
    cartItems,
    getTotalCartAmount,
    clearCart,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const [isPaying, setIsPaying] = useState(false);
  const [successInfo, setSuccessInfo] = useState({
    show: false,
    paymentId: "",
    orderId: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const totalAmount = getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2;

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const buildCartItemsForBackend = () => {
    return food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
      }));
  };

  const syncFrontendCartToBackend = async (items) => {
    await fetch(`${BACKEND_URL}/api/cart/clear/${USER_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    for (const item of items) {
      const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: USER_ID,
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to sync cart with backend");
      }
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (totalAmount <= 0) {
      alert("Cart is empty. Please add items first.");
      return;
    }

    const cartPayload = buildCartItemsForBackend();

    if (cartPayload.length === 0) {
      alert("Cart is empty. Please add items first.");
      return;
    }

    try {
      setIsPaying(true);
      await syncFrontendCartToBackend(cartPayload);

      const paymentResponse = await fetch(`${BACKEND_URL}/api/payment/proceed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: USER_ID,
          paymentMethod: "FAKE_UPI",
          deliveryAddress: formData,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(paymentData.message || "Payment failed");
      }

      clearCart();
      setSuccessInfo({
        show: true,
        paymentId: paymentData?.data?.paymentId || "-",
        orderId: paymentData?.data?.order?.orderId || "-",
      });
    } catch (error) {
      alert(error.message || "Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <form className="place-order" onSubmit={onSubmitHandler}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              required
              name="firstName"
              onChange={onChangeHandler}
              value={formData.firstName}
              type="text"
              placeholder="First name"
            />
            <input
              required
              name="lastName"
              onChange={onChangeHandler}
              value={formData.lastName}
              type="text"
              placeholder="Last name"
            />
          </div>
          <input
            required
            name="email"
            onChange={onChangeHandler}
            value={formData.email}
            type="email"
            placeholder="Email address"
          />
          <input
            required
            name="street"
            onChange={onChangeHandler}
            value={formData.street}
            type="text"
            placeholder="Street"
          />
          <div className="multi-fields">
            <input
              required
              name="city"
              onChange={onChangeHandler}
              value={formData.city}
              type="text"
              placeholder="City"
            />
            <input
              required
              name="state"
              onChange={onChangeHandler}
              value={formData.state}
              type="text"
              placeholder="State"
            />
          </div>
          <div className="multi-fields">
            <input
              required
              name="zipCode"
              onChange={onChangeHandler}
              value={formData.zipCode}
              type="text"
              placeholder="Zip code"
            />
            <input
              required
              name="country"
              onChange={onChangeHandler}
              value={formData.country}
              type="text"
              placeholder="Country"
            />
          </div>
          <input
            required
            name="phone"
            onChange={onChangeHandler}
            value={formData.phone}
            type="text"
            placeholder="Phone"
          />
        </div>
        <div className="place-order-right"></div>
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAmount}</b>
            </div>
          </div>
          <button type="submit" disabled={isPaying}>
            {isPaying ? "PROCESSING..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </form>

      {successInfo.show ? (
        <div className="order-success-overlay">
          <div className="order-success-modal">
            <h2>🎉 Order Placed Successfully</h2>
            <p>Your payment was successful and your cart is now empty.</p>
            <p>
              <strong>Order ID:</strong> {successInfo.orderId}
            </p>
            <p>
              <strong>Payment ID:</strong> {successInfo.paymentId}
            </p>
            <div className="order-success-actions">
              <button type="button" onClick={() => setSuccessInfo({ show: false, paymentId: "", orderId: "" })}>
                Close
              </button>
              <button
                type="button"
                onClick={() => navigate(`/order-status/${successInfo.orderId}`)}
                disabled={!successInfo.orderId || successInfo.orderId === "-"}
              >
                Track Order
              </button>
              <button type="button" onClick={() => navigate("/")}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PlaceOrder;
