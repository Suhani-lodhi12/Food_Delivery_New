package com.fooddelivery.backend1.controller;

import com.fooddelivery.backend1.dto.ApiResponse;
import com.fooddelivery.backend1.dto.OrderTrackingResponse;
import com.fooddelivery.backend1.model.Order;
import com.fooddelivery.backend1.service.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderTrackingResponse> getOrderTrackingDetails(@PathVariable String id) {
        OrderTrackingResponse response = orderService.getOrderTrackingDetails(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));

        return ApiResponse.ok("Order tracking details fetched", response);
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrders(@PathVariable String userId) {
        return ApiResponse.ok("Orders fetched", orderService.getOrders(userId));
    }
}
