package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {
    boolean existsByName(String name);

    boolean existsByCode(String code);

}
