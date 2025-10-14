package com.example.authbackend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key.id:rzp_test_YOUR_KEY_ID}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:YOUR_KEY_SECRET}")
    private String razorpayKeySecret;

    /**
     * Create Razorpay order
     */
    public Map<String, Object> createOrder(Integer amount, String currency, String receipt, Long userId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // Amount in paise
        orderRequest.put("currency", currency != null ? currency : "INR");
        orderRequest.put("receipt", receipt);

        Order order = razorpay.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("status", order.get("status"));
        
        return response;
    }

    /**
     * Verify Razorpay payment signature
     */
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            
            byte[] hash = mac.doFinal(payload.getBytes());
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            String generatedSignature = hexString.toString();
            return generatedSignature.equals(signature);
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Save booking to database
     * TODO: Implement actual database save logic based on your Booking entity
     */
    public Long saveBooking(Long userId, List<Map<String, Object>> cartItems, Integer amount, 
                           String paymentId, String orderId) {
        // TODO: Implement booking save logic
        // For now, return a mock booking ID
        // You should:
        // 1. Create a Booking entity
        // 2. Save cart items as booking items
        // 3. Store payment details
        // 4. Return the saved booking ID
        
        return System.currentTimeMillis(); // Mock booking ID
    }

    /**
     * Get payment status from Razorpay
     */
    public Map<String, Object> getPaymentStatus(String paymentId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        
        com.razorpay.Payment payment = razorpay.payments.fetch(paymentId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", payment.get("id"));
        response.put("amount", payment.get("amount"));
        response.put("currency", payment.get("currency"));
        response.put("status", payment.get("status"));
        response.put("method", payment.get("method"));
        response.put("created_at", payment.get("created_at"));
        
        return response;
    }
}
