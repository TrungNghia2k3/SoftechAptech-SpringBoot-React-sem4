package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Payment;
import com.devteria.identityservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
