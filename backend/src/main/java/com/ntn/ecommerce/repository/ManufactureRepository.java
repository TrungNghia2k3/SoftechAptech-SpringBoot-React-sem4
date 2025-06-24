package com.ntn.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.Manufacture;

@Repository
public interface ManufactureRepository extends JpaRepository<Manufacture, Long> {

    boolean existsByName(String name);
}
