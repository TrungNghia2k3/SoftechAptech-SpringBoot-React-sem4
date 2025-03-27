package com.devteria.identityservice.repository;


import com.devteria.identityservice.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FeedbackRepository extends JpaRepository <Feedback, Long> {}
