package com.devteria.identityservice.service;

import com.devteria.identityservice.repository.InvalidatedTokenRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvalidatedTokenService {

    InvalidatedTokenRepository invalidatedTokenRepository;

    @EventListener(ContextRefreshedEvent.class)
    @Transactional
    public void deleteExpiredTokens() {

        // Get the start of today (00:00:00 of the current day)
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startOfToday = calendar.getTime();

        // Delete records with expiry_time before the start of today
        invalidatedTokenRepository.deleteByExpiryTimeBefore(startOfToday);
    }
}
