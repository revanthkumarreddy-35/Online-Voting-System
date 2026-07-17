package com.auca.onlinevotingsystem.controller;



import com.auca.onlinevotingsystem.model.Notification;
import com.auca.onlinevotingsystem.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/unread")
    public List<Notification> getUnreadNotificationsForUser() {
        return notificationService.getUnreadNotifications();
    }


    @PostMapping("/send")
    public void sendNotification(@RequestParam String title, @RequestParam String message) {
        notificationService.sendNotification(title, message);
    }

    @PutMapping("/mark-as-read/{id}")
    public void markNotificationAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
    @PutMapping("/user/mark-all-as-read")
    public void markAllNotificationsAsRead() {
        notificationService.markAllAsRead();
    }

}
