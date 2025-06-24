package com.ntn.ecommerce.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ntn.ecommerce.dto.request.CategoryRequest;
import com.ntn.ecommerce.dto.response.CategoryResponse;
import com.ntn.ecommerce.dto.response.PageResponse;
import com.ntn.ecommerce.entity.Category;
import com.ntn.ecommerce.exception.AppException;
import com.ntn.ecommerce.exception.ErrorCode;
import com.ntn.ecommerce.mapper.CategoryMapper;
import com.ntn.ecommerce.repository.CategoryRepository;
import com.ntn.ecommerce.repository.ProductRepository;
import com.ntn.ecommerce.utilities.ImageUtilities;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryService {
    private static final String BASE_IMAGE_URL = "http://localhost:8080/api/images/category/";
    CategoryRepository categoryRepository;
    ProductRepository productRepository;
    CategoryMapper categoryMapper;
    ImageUtilities imageUtilities;

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse create(CategoryRequest request, MultipartFile image) throws IOException {

        // Kiem tra name da ton tai chua
        if (categoryRepository.existsByName(request.getName())) throw new AppException(ErrorCode.CATEGORY_NAME_EXISTED);

        // Kiem tra code da ton tai chua
        if (categoryRepository.existsByCode(request.getCode())) throw new AppException(ErrorCode.CATEGORY_CODE_EXISTED);

        Category category = categoryMapper.toCategory(request); // Chuyển request qua Entity

        category.setCode(request.getCode().toUpperCase());
        category.setDisabled(false);

        category = categoryRepository.save(category); // Save to get the categoryId

        if (image != null && !image.isEmpty()) {
            String imagePath = imageUtilities.saveFile(
                    "category", String.valueOf(category.getId()), image.getOriginalFilename(), image);
            category.setImage(imagePath);
        }

        Category savedCategory = categoryRepository.save(category);

        // Map to response and return
        return mapToProductResponse(savedCategory);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse update(Long categoryId, CategoryRequest request, MultipartFile image) throws IOException {

        // Lấy danh mục hiện tại
        Category category = categoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Kiểm tra trùng lặp tên, loại trừ danh mục hiện tại
        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTED);
        }

        // Kiểm tra trùng lặp mã, loại trừ danh mục hiện tại
        if (!category.getCode().equals(request.getCode()) && categoryRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.CATEGORY_CODE_EXISTED);
        }

        // Xóa ảnh cũ nếu có ảnh mới và ảnh cũ tồn tại
        if (image != null
                && !image.isEmpty()
                && category.getImage() != null
                && !category.getImage().isEmpty()) {
            imageUtilities.deleteFile("category", String.valueOf(categoryId), category.getImage());
        }

        // Cập nhật các thuộc tính của danh mục
        categoryMapper.updateCategory(request, category);

        // Lưu ảnh mới nếu có
        if (image != null && !image.isEmpty()) {
            String imagePath = imageUtilities.saveFile(
                    "category", String.valueOf(category.getId()), image.getOriginalFilename(), image);
            category.setImage(imagePath);
        }

        // Lưu danh mục cập nhật
        Category updatedCategory = categoryRepository.save(category);

        // Chuyển đổi sang response và trả về
        return mapToProductResponse(updatedCategory);
    }

    public CategoryResponse getById(Long categoryId) {
        Category category = categoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Map to response and return
        return mapToProductResponse(category);
    }

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .filter(category -> !category.isDisabled())
                .map(this::mapToProductResponse)
                .toList();
    }

    public List<CategoryResponse> searchByKeyword(String keyword) {
        List<Category> categories = categoryRepository.findByNameContainingIgnoreCase(keyword);
        return categories.stream().map(this::mapToProductResponse).collect(Collectors.toList());
    }

    public PageResponse<CategoryResponse> getAllCategories(int page, int size, String sortBy, String sortDirection) {
        // Adjust page number to start from 1 instead of 0
        page = (page > 0) ? page - 1 : 0;

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Category> categories = categoryRepository.findAll(pageable);
        Page<CategoryResponse> categoryResponses = categories.map(this::mapToProductResponse);

        return new PageResponse<>(categoryResponses);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Long id) throws IOException {
        // Kiểm tra xem category có tồn tại hay không?
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Kiểm tra xem Category có liên kết với bất kỳ sản phẩm nào không?
        if (productRepository.existsByCategoryId(id)) {
            throw new AppException(ErrorCode.CATEGORY_ASSOCIATED_PRODUCT);
        }

        // Xóa ảnh, nếu ảnh cũ tồn tại
        if (category.getImage() != null && !category.getImage().isEmpty()) {
            imageUtilities.deleteFile("category", String.valueOf(id), category.getImage());
        }

        // Xóa Category nếu không có sản phẩm nào liên kết
        categoryRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse toggleDisabled(Long id) {

        // Tìm kiếm Category theo id
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Cập nhật thuộc tính isDisabled
        category.setDisabled(!category.isDisabled());

        // Lưu Category và chuyển đổi sang CategoryResponse
        Category updateCategory = categoryRepository.save(category);

        return mapToProductResponse(updateCategory);
    }

    private CategoryResponse mapToProductResponse(Category category) {
        CategoryResponse response = categoryMapper.toCategoryResponse(category);

        response.setImage(buildImageUrl(category.getId(), category.getImage()));

        return response;
    }

    private String buildImageUrl(Long categoryId, String imageName) {
        return BASE_IMAGE_URL + categoryId + "/" + imageName;
    }
}
