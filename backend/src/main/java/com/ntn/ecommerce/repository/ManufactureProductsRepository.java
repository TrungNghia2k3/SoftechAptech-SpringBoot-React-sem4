package com.ntn.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.ManufactureProducts;

@Repository
public interface ManufactureProductsRepository extends JpaRepository<ManufactureProducts, Long> {
    List<ManufactureProducts> findByProductId(String productId);

    List<ManufactureProducts> findAllByManufactureId(Long manufactureId);
}
