package com.example.authbackend.service;

import com.example.authbackend.model.Payment;
import com.example.authbackend.model.BookingNew;
import com.example.authbackend.repository.PaymentRepository;
import com.example.authbackend.repository.BookingNewRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key.id:rzp_test_YOUR_KEY_ID}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:YOUR_KEY_SECRET}")
    private String razorpayKeySecret;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingNewRepository bookingRepository;

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
    
    /**
     * Create payment record when Razorpay order is created
     */
    public Payment createPaymentRecord(Long bookingId, Long userId, BigDecimal subtotal, 
                                      BigDecimal platformFee, BigDecimal gstAmount, 
                                      BigDecimal discountAmount, String promoCode, 
                                      BigDecimal totalAmount, String razorpayOrderId) {
        Payment payment = new Payment();
        
        // Generate payment number
        String paymentNumber = generatePaymentNumber();
        payment.setPaymentNumber(paymentNumber);
        
        // Set booking and user
        payment.setBookingId(bookingId);
        payment.setUserId(userId);
        
        // Set amounts
        payment.setSubtotal(subtotal);
        payment.setPlatformFee(platformFee);
        payment.setGstAmount(gstAmount);
        payment.setDiscountAmount(discountAmount);
        payment.setPromoCode(promoCode);
        payment.setTotalAmount(totalAmount);
        
        // Set payment details
        payment.setPaymentMethod("RAZORPAY");
        payment.setPaymentGateway("RAZORPAY");
        payment.setPaymentStatus("PENDING");
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setPaymentInitiatedAt(LocalDateTime.now());
        
        // Get booking details for denormalization
        BookingNew booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            payment.setCustomerName(booking.getUserName());
            payment.setCustomerEmail(booking.getUserEmail());
            payment.setCustomerPhone(booking.getPhone());
            payment.setPaymentDescription("Payment for " + booking.getServiceName());
        }
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Update payment record on successful payment
     */
    public Payment updatePaymentOnSuccess(String razorpayOrderId, String razorpayPaymentId, 
                                         String razorpaySignature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
            .orElseThrow(() -> new RuntimeException("Payment not found for order: " + razorpayOrderId));
        
        payment.setPaymentStatus("COMPLETED");
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setTransactionId(razorpayPaymentId);
        payment.setPaymentCompletedAt(LocalDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update booking status
        if (payment.getBookingId() != null) {
            BookingNew booking = bookingRepository.findById(payment.getBookingId()).orElse(null);
            if (booking != null) {
                booking.setPaymentStatus("PAID");
                booking.setStatus("PAYMENT_COMPLETED");
                booking.setTransactionId(razorpayPaymentId);
                bookingRepository.save(booking);
            }
        }
        
        return savedPayment;
    }
    
    /**
     * Update payment record on failure
     */
    public Payment updatePaymentOnFailure(String razorpayOrderId, String failureReason) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
            .orElseThrow(() -> new RuntimeException("Payment not found for order: " + razorpayOrderId));
        
        payment.setPaymentStatus("FAILED");
        payment.setFailureReason(failureReason);
        payment.setPaymentFailedAt(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Generate unique payment number
     */
    private String generatePaymentNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = paymentRepository.count() + 1;
        return String.format("PAY-%s-%05d", date, count);
    }
    
    /**
     * Get payment by booking ID
     */
    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId).orElse(null);
    }
    
    /**
     * Get all payments by user
     */
    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
