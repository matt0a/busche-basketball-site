package org.buscheacademy.basketball.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@buscheacademy.org}")
    private String fromAddress;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Reset your Busche Academy Basketball password");
        message.setText(
                "We received a request to reset the password for your Busche Academy Basketball account.\n\n" +
                        "Use the link below to choose a new password. This link expires in 30 minutes and can only be used once:\n\n" +
                        resetLink + "\n\n" +
                        "If you did not request this, you can safely ignore this email — your password will not change."
        );
        mailSender.send(message);
    }
}
