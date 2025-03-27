package com.devteria.identityservice.utilities;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailUtilities {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendSetPasswordEmail(String username) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        mimeMessageHelper.setTo(username);
        mimeMessageHelper.setSubject("Set Password");
        mimeMessageHelper.setText(
                """
                        <div>
                        <a href="http://localhost:3000/forgot-password?username=%s" target="_blank">Click here to reset your password</a>
                        </div>
                        """
                        .formatted(username),
                true);
        javaMailSender.send(mimeMessage);
    }

    public void sendOtpEmail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        mimeMessageHelper.setTo(email);
        mimeMessageHelper.setSubject("Your OTP Code");
        mimeMessageHelper.setText(
                """
                        <div>
                        <p>Dear user,</p>
                        <p>Your OTP code is: <b>%s</b></p>
                        <p>Please use this code to complete your verification process.</p>
                        <p>Thank you!</p>
                        </div>
                        """
                        .formatted(otp),
                true);

        javaMailSender.send(mimeMessage);
    }
}
