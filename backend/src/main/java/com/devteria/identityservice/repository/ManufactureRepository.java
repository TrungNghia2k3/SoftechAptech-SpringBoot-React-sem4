package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Manufacture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManufactureRepository  extends JpaRepository<Manufacture, Long> {

    boolean existsByName(String name);
}
