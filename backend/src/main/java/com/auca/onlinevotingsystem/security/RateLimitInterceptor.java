package com.auca.onlinevotingsystem.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    // Simple in-memory rate limiter for anomaly detection simulation
    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    // Limit: 50 requests per minute per IP for regular traffic
    // For votes specifically, we could be even stricter.
    private static final long CAPACITY = 50;
    private static final long REFILL_TOKENS = 50;
    private static final long REFILL_PERIOD = TimeUnit.MINUTES.toMillis(1);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = request.getRemoteAddr();
        
        TokenBucket bucket = buckets.computeIfAbsent(clientIp, k -> new TokenBucket(CAPACITY, REFILL_TOKENS, REFILL_PERIOD));
        
        if (bucket.tryConsume()) {
            return true;
        } else {
            System.err.println("[SECURITY ANOMALY DETECTED] Rate limit exceeded for IP: " + clientIp);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Please try again later.");
            return false;
        }
    }

    private static class TokenBucket {
        private final long capacity;
        private final long refillTokens;
        private final long refillPeriod;
        private long tokens;
        private long lastRefillTime;

        public TokenBucket(long capacity, long refillTokens, long refillPeriod) {
            this.capacity = capacity;
            this.refillTokens = refillTokens;
            this.refillPeriod = refillPeriod;
            this.tokens = capacity;
            this.lastRefillTime = System.currentTimeMillis();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsedTime = now - lastRefillTime;
            
            if (elapsedTime >= refillPeriod) {
                long tokensToAdd = (elapsedTime / refillPeriod) * refillTokens;
                tokens = Math.min(capacity, tokens + tokensToAdd);
                lastRefillTime = now;
            }
        }
    }
}
