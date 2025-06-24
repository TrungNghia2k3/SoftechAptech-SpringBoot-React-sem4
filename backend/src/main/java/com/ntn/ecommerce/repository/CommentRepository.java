package com.ntn.ecommerce.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProductId(String productId);

    @Query(
            "SELECT COUNT(c) FROM Comment c WHERE c.user.id = :userId AND c.product.id = :productId AND c.createdDate >= :startOfDay AND c.createdDate <= :endOfDay")
    Long countCommentsByUserAndProductInDay(
            @Param("userId") String userId,
            @Param("productId") String productId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}
