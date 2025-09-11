//package com.example.authbackend.repository;
//
//import com.example.authbackend.entity.OtpVerification;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//
//@Repository
//public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
//    Optional<OtpVerification> findByOtpId(String otpId);
//    Optional<OtpVerification> findTopByPhoneNumberOrderByCreatedAtDesc(String phoneNumber);
//    Optional<OtpVerification> findTopByUserIdOrderByCreatedAtDesc(Long userId);
//}
