package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.ManufactureProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManufactureProductsRepository extends JpaRepository<ManufactureProducts, Long> {
    List<ManufactureProducts> findByProductId(String productId);
    List<ManufactureProducts> findAllByManufactureId(Long manufactureId);
}
