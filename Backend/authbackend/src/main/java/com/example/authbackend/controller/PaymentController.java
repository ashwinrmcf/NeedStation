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
     * Verify Razorpay payment signature and create payment records
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            System.out.println("💳 Payment verification started");
            System.out.println("📋 Razorpay Order ID: " + request.getRazorpay_order_id());
            System.out.println("📋 Razorpay Payment ID: " + request.getRazorpay_payment_id());
            System.out.println("📋 Accepted Quotations: " + request.getAcceptedQuotations());
            
            boolean isValid = paymentService.verifyPaymentSignature(
                request.getRazorpay_order_id(),
                request.getRazorpay_payment_id(),
                request.getRazorpay_signature()
            );

            if (isValid) {
                System.out.println("✅ Payment signature verified");
                
                // Create payment records for each accepted quotation
                if (request.getAcceptedQuotations() != null && !request.getAcceptedQuotations().isEmpty()) {
                    for (Long bookingId : request.getAcceptedQuotations()) {
                        System.out.println("💾 Creating payment record for booking: " + bookingId);
                        
                        // Create payment record
                        com.example.authbackend.model.Payment payment = paymentService.createPaymentRecord(
                            bookingId,
                            request.getUserId(),
                            java.math.BigDecimal.valueOf(request.getSubtotal() != null ? request.getSubtotal() : 0),
                            java.math.BigDecimal.valueOf(request.getPlatformFee() != null ? request.getPlatformFee() : 0),
                            java.math.BigDecimal.valueOf(request.getGst() != null ? request.getGst() : 0),
                            java.math.BigDecimal.valueOf(request.getDiscountAmount() != null ? request.getDiscountAmount() : 0),
                            request.getPromoCode(),
                            java.math.BigDecimal.valueOf(request.getAmount()),
                            request.getRazorpay_order_id()
                        );
                        
                        // Update payment on success
                        paymentService.updatePaymentOnSuccess(
                            request.getRazorpay_order_id(),
                            request.getRazorpay_payment_id(),
                            request.getRazorpay_signature()
                        );
                        
                        System.out.println("✅ Payment record created: " + payment.getPaymentNumber());
                    }
                }

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Payment verified and recorded successfully");
                response.put("bookingIds", request.getAcceptedQuotations());
                
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Payment signature verification failed");
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Payment verification failed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
        } catch (Exception e) {
            System.out.println("❌ Payment verification error: " + e.getMessage());
            e.printStackTrace();
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
