package com.ntn.ecommerce.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findProductByCategoryId(Long categoryId);

    List<Product> findProductByPublisherId(Long publisherId);

    List<Product> findByAuthor(String name);

    List<Product> findByCategoryCodeAndPublisherCode(String categoryCode, String publisherCode);

    boolean existsByPublisherId(Long publisherId);

    boolean existsByCategoryId(Long categoryId);

    //    boolean existsByTitle(String title);
    //
    //    boolean existsByIsbn10(String isbn10);
    //
    //    boolean existsByIsbn13(String isbn13);

    boolean existsByTitleOrIsbn10OrIsbn13(String title, String isbn10, String isbn13);

    // It checks if a product with the given title, ISBN10, or ISBN13 exists excluding the current product being
    // updated.
    boolean existsByTitleOrIsbn10OrIsbn13AndIdNot(String title, String isbn10, String isbn13, String id);

    boolean existsByTitleAndIdNot(String title, String id);

    boolean existsByIsbn10AndIdNot(String isbn10, String id);

    boolean existsByIsbn13AndIdNot(String isbn13, String id);

    @Query("SELECT p FROM Product p WHERE " + "(:categoryId IS NULL OR p.category.id = :categoryId) AND "
            + "(:publisherId IS NULL OR p.publisher.id = :publisherId) AND "
            + "(:formality IS NULL OR p.formality IN (:formality)) AND "
            + "(:minPrice IS NULL OR p.price >= :minPrice) AND "
            + "(:maxPrice IS NULL OR p.price <= :maxPrice) AND "
            + "(:title IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%')))")
    Page<Product> filterProducts(
            Long categoryId,
            Long publisherId,
            List<String> formality,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String title,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " + "(:keyword IS NULL OR CAST(p.id AS string) = :keyword) OR "
            + "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
            + "p.isbn10 = :keyword OR "
            + "p.isbn13 = :keyword")
    List<Product> searchProducts(@Param("keyword") String keyword);
}
