package com.ntn.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {}
