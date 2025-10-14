package com.example.authbackend.controller;

import com.example.authbackend.dto.PaymentOrderRequest;
import com.example.authbackend.dto.PaymentVerificationRequest;
import com.example.authbackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create Razorpay order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrderRequest request) {
        try {
            Map<String, Object> orderData = paymentService.createOrder(
                request.getAmount(),
                request.getCurrency(),
                request.getReceipt(),
                request.getUserId()
            );
            
            return ResponseEntity.ok(orderData);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Verify Razorpay payment signature
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            boolean isValid = paymentService.verifyPaymentSignature(
                request.getRazorpay_order_id(),
                request.getRazorpay_payment_id(),
                request.getRazorpay_signature()
            );

            if (isValid) {
                // Save booking to database
                Long bookingId = paymentService.saveBooking(
                    request.getUserId(),
                    request.getCartItems(),
                    request.getAmount(),
                    request.getRazorpay_payment_id(),
                    request.getRazorpay_order_id()
                );

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Payment verified successfully");
                response.put("bookingId", bookingId);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Payment verification failed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Payment verification error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get payment status
     */
    @GetMapping("/status/{paymentId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String paymentId) {
        try {
            Map<String, Object> status = paymentService.getPaymentStatus(paymentId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to get payment status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
