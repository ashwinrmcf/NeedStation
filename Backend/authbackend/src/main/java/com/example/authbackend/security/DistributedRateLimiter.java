package com.example.authbackend.security;

import com.example.authbackend.exception.RateLimitExceededException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
public class DistributedRateLimiter {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Rate limit configurations
    private static final int MAX_REQUESTS_PER_IP = 10;
    private static final int MAX_REQUESTS_PER_PHONE = 5;
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final Duration TIME_WINDOW = Duration.ofMinutes(15);
    private static final Duration LOGIN_LOCKOUT_DURATION = Duration.ofMinutes(30);

    /**
     * Check if an IP has exceeded rate limits for OTP requests
     */
    public boolean isIpLimited(String ip) {
        String key = "rate_limit:ip:" + ip;
        return checkRateLimit(key, MAX_REQUESTS_PER_IP, TIME_WINDOW);
    }

    /**
     * Check if a phone number has exceeded rate limits for OTP requests
     */
    public boolean isPhoneLimited(String phone) {
        String key = "rate_limit:phone:" + phone;
        return checkRateLimit(key, MAX_REQUESTS_PER_PHONE, TIME_WINDOW);
    }

    /**
     * Check if a user has exceeded login attempt limits
     */
    public boolean isLoginLimited(String identifier) {
        String key = "rate_limit:login:" + identifier;
        return checkRateLimit(key, MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_DURATION);
    }

    /**
     * Increment rate limit counter for IP
     */
    public void incrementIpAttempts(String ip) {
        String key = "rate_limit:ip:" + ip;
        incrementCounter(key, TIME_WINDOW);
    }

    /**
     * Increment rate limit counter for phone
     */
    public void incrementPhoneAttempts(String phone) {
        String key = "rate_limit:phone:" + phone;
        incrementCounter(key, TIME_WINDOW);
    }

    /**
     * Increment login attempt counter
     */
    public void incrementLoginAttempts(String identifier) {
        String key = "rate_limit:login:" + identifier;
        incrementCounter(key, LOGIN_LOCKOUT_DURATION);
    }

    /**
     * Reset rate limit for successful login
     */
    public void resetLoginAttempts(String identifier) {
        String key = "rate_limit:login:" + identifier;
        redisTemplate.delete(key);
    }

    /**
     * Get current attempt count for IP
     */
    public int getIpAttemptCount(String ip) {
        String key = "rate_limit:ip:" + ip;
        return getCurrentCount(key);
    }

    /**
     * Get current attempt count for phone
     */
    public int getPhoneAttemptCount(String phone) {
        String key = "rate_limit:phone:" + phone;
        return getCurrentCount(key);
    }

    /**
     * Get current login attempt count
     */
    public int getLoginAttemptCount(String identifier) {
        String key = "rate_limit:login:" + identifier;
        return getCurrentCount(key);
    }

    /**
     * Check rate limit and throw exception if exceeded
     */
    public void checkAndThrowIfLimited(String ip, String phone) {
        if (isIpLimited(ip)) {
            throw new RateLimitExceededException("IP address", MAX_REQUESTS_PER_IP, "15 minutes");
        }
        
        if (phone != null && isPhoneLimited(phone)) {
            throw new RateLimitExceededException("phone number", MAX_REQUESTS_PER_PHONE, "15 minutes");
        }
    }

    /**
     * Check login rate limit and throw exception if exceeded
     */
    public void checkLoginRateLimit(String identifier) {
        if (isLoginLimited(identifier)) {
            throw new RateLimitExceededException("login attempts", MAX_LOGIN_ATTEMPTS, "30 minutes");
        }
    }

    /**
     * Generic rate limit check
     */
    private boolean checkRateLimit(String key, int maxAttempts, Duration window) {
        try {
            Integer currentCount = (Integer) redisTemplate.opsForValue().get(key);
            return currentCount != null && currentCount >= maxAttempts;
        } catch (Exception e) {
            // If Redis is down, allow the request but log the error
            // In production, you might want to implement a fallback mechanism
            return false;
        }
    }

    /**
     * Increment counter with expiration
     */
    private void incrementCounter(String key, Duration window) {
        try {
            Long newCount = redisTemplate.opsForValue().increment(key);
            if (newCount == 1) {
                // Set expiration only for the first increment
                redisTemplate.expire(key, window.toSeconds(), TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            // Log error but don't fail the request
            // In production, implement proper error handling
        }
    }

    /**
     * Get current count
     */
    private int getCurrentCount(String key) {
        try {
            Integer count = (Integer) redisTemplate.opsForValue().get(key);
            return count != null ? count : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Check if Redis is available
     */
    public boolean isRedisAvailable() {
        try {
            redisTemplate.opsForValue().get("health_check");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
