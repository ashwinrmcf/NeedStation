package com.example.authbackend.repository;

import com.example.authbackend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // Find payment by booking ID
    Optional<Payment> findByBookingId(Long bookingId);
    
    // Find all payments by booking ID (in case of multiple payment attempts)
    List<Payment> findAllByBookingId(Long bookingId);
    
    // Find payment by payment number
    Optional<Payment> findByPaymentNumber(String paymentNumber);
    
    // Find payment by transaction ID
    Optional<Payment> findByTransactionId(String transactionId);
    
    // Find payment by Razorpay order ID
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    
    // Find payment by Razorpay payment ID
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    
    // Find all payments by user
    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find payments by status
    List<Payment> findByPaymentStatus(String paymentStatus);
    
    // Find payments by user and status
    List<Payment> findByUserIdAndPaymentStatus(Long userId, String paymentStatus);
    
    // Find successful payments by user
    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.paymentStatus = 'COMPLETED' ORDER BY p.createdAt DESC")
    List<Payment> findSuccessfulPaymentsByUser(@Param("userId") Long userId);
    
    // Find failed payments by user
    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.paymentStatus = 'FAILED' ORDER BY p.createdAt DESC")
    List<Payment> findFailedPaymentsByUser(@Param("userId") Long userId);
    
    // Find pending payments older than specified time
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = 'PENDING' AND p.paymentInitiatedAt < :cutoffTime")
    List<Payment> findPendingPaymentsOlderThan(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    // Get total revenue (completed payments)
    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    Double getTotalRevenue();
    
    // Get total revenue by date range
    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM Payment p WHERE p.paymentStatus = 'COMPLETED' AND p.paymentCompletedAt BETWEEN :startDate AND :endDate")
    Double getRevenueByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Count payments by status
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentStatus = :status")
    Long countByStatus(@Param("status") String status);
    
    // Find refunded payments
    @Query("SELECT p FROM Payment p WHERE p.refundStatus IN ('PARTIAL', 'FULL') ORDER BY p.refundCompletedAt DESC")
    List<Payment> findRefundedPayments();
    
    // Check if booking has successful payment
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Payment p WHERE p.bookingId = :bookingId AND p.paymentStatus = 'COMPLETED'")
    boolean hasSuccessfulPayment(@Param("bookingId") Long bookingId);
}
