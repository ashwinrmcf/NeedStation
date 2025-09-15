package com.example.authbackend.exception;

public class RateLimitExceededException extends RuntimeException {
    
    public RateLimitExceededException(String message) {
        super(message);
    }
    
    public RateLimitExceededException(String resource, int maxAttempts) {
        super("Rate limit exceeded for " + resource + ". Maximum " + maxAttempts + " attempts allowed.");
    }
    
    public RateLimitExceededException(String resource, int maxAttempts, String timeWindow) {
        super("Rate limit exceeded for " + resource + ". Maximum " + maxAttempts + " attempts allowed per " + timeWindow + ".");
    }
}
