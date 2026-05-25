package com.fooddelivery.backend1.service;

import com.fooddelivery.backend1.dto.OrderTrackingResponse;
import com.fooddelivery.backend1.model.CartItem;
import com.fooddelivery.backend1.model.DeliveryAddress;
import com.fooddelivery.backend1.model.Order;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OrderService {

    private final Map<String, List<Order>> userOrders = new ConcurrentHashMap<>();
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");
    private static final List<String> DELIVERY_PARTNER_NAMES = List.of(
        "Marcus Thompson",
        "Alex Sharma",
        "Rohan Verma",
        "Ananya Singh"
    );
    private static final List<String> DELIVERY_PARTNER_PHONES = List.of(
        "+91-9876543210",
        "+91-9876543211",
        "+91-9876543212",
        "+91-9876543213"
    );

    public Order createPlacedOrder(String userId,
                                   List<CartItem> cartItems,
                                   DeliveryAddress address,
                                   String paymentMethod,
                                   String paymentId,
                                   BigDecimal subtotal,
                                   BigDecimal deliveryFee,
                                   BigDecimal total) {

        Order order = new Order();
        order.setOrderId("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUserId(userId);
        order.setItems(new ArrayList<>(cartItems));
        order.setDeliveryAddress(address);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentId(paymentId);
        order.setPaymentStatus("SUCCESS");
        order.setOrderStatus("PLACED");
        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTotal(total);
        order.setPlacedAt(LocalDateTime.now());
        order.setEstimatedDeliveryTime(order.getPlacedAt().plusMinutes(6));

        int partnerIndex = Math.abs(order.getOrderId().hashCode()) % DELIVERY_PARTNER_NAMES.size();
        order.setDeliveryPartnerName(DELIVERY_PARTNER_NAMES.get(partnerIndex));
        order.setDeliveryPartnerPhone(DELIVERY_PARTNER_PHONES.get(partnerIndex));

        userOrders.computeIfAbsent(userId, ignored -> new ArrayList<>()).add(0, order);
        return order;
    }

    public List<Order> getOrders(String userId) {
        return userOrders.getOrDefault(userId, List.of());
    }

    public Optional<OrderTrackingResponse> getOrderTrackingDetails(String orderId) {
        return userOrders.values().stream()
                .flatMap(List::stream)
                .filter(order -> order.getOrderId().equalsIgnoreCase(orderId))
                .findFirst()
                .map(order -> {
                    updateOrderStatusByElapsedTime(order);
                    return toTrackingResponse(order);
                });
    }

    private void updateOrderStatusByElapsedTime(Order order) {
        if (order.getPlacedAt() == null) {
            order.setOrderStatus("ORDER_CONFIRMED");
            return;
        }

        long elapsedSeconds = Duration.between(order.getPlacedAt(), LocalDateTime.now()).toSeconds();

        if (elapsedSeconds < 90) {
            order.setOrderStatus("ORDER_CONFIRMED");
        } else if (elapsedSeconds < 180) {
            order.setOrderStatus("RESTAURANT_PREPARING_FOOD");
        } else if (elapsedSeconds < 300) {
            order.setOrderStatus("OUT_FOR_DELIVERY");
        } else {
            order.setOrderStatus("DELIVERED");
        }
    }

    private OrderTrackingResponse toTrackingResponse(Order order) {
        OrderTrackingResponse response = new OrderTrackingResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderItems(order.getItems());
        response.setTotalPrice(order.getTotal());
        response.setOrderStatus(order.getOrderStatus());
        response.setDeliveryPartnerName(order.getDeliveryPartnerName());
        response.setDeliveryPartnerPhone(order.getDeliveryPartnerPhone());
        response.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime() == null
                ? "--"
                : order.getEstimatedDeliveryTime().format(TIME_FORMATTER));
        return response;
    }
}
