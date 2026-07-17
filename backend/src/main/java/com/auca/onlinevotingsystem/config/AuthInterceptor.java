package com.auca.onlinevotingsystem.config;

import com.auca.onlinevotingsystem.model.Role;
import com.auca.onlinevotingsystem.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();
        
        // Skip authentication for public endpoints
        if (uri.startsWith("/api/users/login") || uri.startsWith("/api/users/register") 
            || uri.startsWith("/api/password-reset") || uri.startsWith("/api/auth")) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Please log in first.");
            return false;
        }

        User user = (User) session.getAttribute("user");

        // Role-based authorization
        if (uri.startsWith("/api/admin") || uri.startsWith("/api/candidates") || uri.startsWith("/api/elections")) {
            // These endpoints require ADMIN or MASTER_ADMIN
            if (user.getRole() != Role.ROLE_ADMIN && user.getRole() != Role.ROLE_MASTER_ADMIN) {
                // EXCEPTION: GET requests to candidates and elections are allowed for voters
                if ("GET".equalsIgnoreCase(request.getMethod()) && (uri.startsWith("/api/candidates") || uri.startsWith("/api/elections"))) {
                    return true;
                }
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden: Admin access required.");
                return false;
            }
        }

        return true;
    }
}
