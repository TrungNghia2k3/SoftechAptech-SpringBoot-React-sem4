package com.ntn.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ntn.ecommerce.entity.UserAddress;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    Optional<UserAddress> findById(long id);

    List<UserAddress> findByUserId(String userId);

    boolean existsByFullAddressAndUserId(String fullAddress, String userId);

    @Transactional
    @Modifying
    @Query("UPDATE UserAddress ua SET ua.isDefault = false WHERE ua.user.id = :userId")
    void updateAllAddressesToNonDefault(@Param("userId") String userId);

    boolean existsByUserId(String userId);
}
