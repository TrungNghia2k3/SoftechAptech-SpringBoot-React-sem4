package com.devteria.identityservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devteria.identityservice.entity.InvalidatedToken;

import java.time.LocalDateTime;
import java.util.Date;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    void deleteByExpiryTimeBefore(Date expiryTime);
}
