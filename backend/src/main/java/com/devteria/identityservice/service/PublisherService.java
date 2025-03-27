package com.devteria.identityservice.service;


import com.devteria.identityservice.dto.request.PublisherRequest;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.dto.response.PublisherResponse;
import com.devteria.identityservice.entity.Publisher;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.PublisherMapper;
import com.devteria.identityservice.repository.ProductRepository;
import com.devteria.identityservice.repository.PublisherRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherService {
    PublisherRepository publisherRepository;
    PublisherMapper publisherMapper;
    ProductRepository productRepository;

    public List<PublisherResponse> getAll() {
        return publisherRepository.findAll()
                .stream()
                .filter(publisher -> !publisher.isDisabled())
                .map(publisherMapper::toPublisherResponse)
                .toList();
    }

    public PageResponse<PublisherResponse> getAllPublishers(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = createPageable(page, size, sortBy, sortDirection);

        Page<Publisher> publishers = publisherRepository.findAll(pageable);

        Page<PublisherResponse> publisherResponses = publishers.map(publisherMapper::toPublisherResponse);

        return new PageResponse<>(publisherResponses);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PublisherResponse createPublisher(PublisherRequest request) {

        // Kiểm tra publisher name có tồn tại chưa?
        if (publisherRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PUBLISHER_NAME_EXISTED);
        }

        // Kiểm tra publisher code có tồn tại chưa?
        if (publisherRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.PUBLISHER_CODE_EXISTED);
        }

        Publisher publisher = publisherMapper.toPublisher(request);

        publisher.setCode(request.getCode().toUpperCase());
        publisher.setDisabled(false);

        publisher = publisherRepository.save(publisher);

        return publisherMapper.toPublisherResponse(publisher);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PublisherResponse updatePublisher(Long id, PublisherRequest request) {
        Optional<Publisher> existingPublisherOpt = publisherRepository.findById(id);
        if (existingPublisherOpt.isPresent()) {
            Publisher existingPublisher = existingPublisherOpt.get();

            if (!existingPublisher.getName().equals(request.getName()) && publisherRepository.existsByName(request.getName())) {
                throw new AppException(ErrorCode.PUBLISHER_NAME_EXISTED);
            }
            if (!existingPublisher.getCode().equals(request.getCode()) && publisherRepository.existsByCode(request.getCode())) {
                throw new AppException(ErrorCode.PUBLISHER_CODE_EXISTED);
            }

            // Sử dụng MapStruct để cập nhật các trường
            publisherMapper.updatePublisher(existingPublisher, request);

            existingPublisher.setCode(request.getCode().toUpperCase());

            existingPublisher = publisherRepository.save(existingPublisher);
            return publisherMapper.toPublisherResponse(existingPublisher);
        } else {
            throw new AppException(ErrorCode.PUBLISHER_NOT_FOUND);
        }
    }

    public PublisherResponse getPublisherById(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
        return publisherMapper.toPublisherResponse(publisher);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deletePublisher(Long id) {
        // Kiểm tra xem Publisher có tồn tại hay không?
        if (!publisherRepository.existsById(id)) {
            throw new AppException(ErrorCode.PUBLISHER_NOT_FOUND);
        }

        // Kiểm tra xem Publisher có liên kết với bất kỳ sản phẩm nào không?
        if (productRepository.existsByPublisherId(id)) {
            throw new AppException(ErrorCode.PUBLISHER_ASSOCIATED_PRODUCT);
        }

        // Xóa Publisher nếu không có sản phẩm nào liên kết
        publisherRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PublisherResponse toggleDisabledPublisher(Long id) {

        // Tìm kiếm Publisher theo id
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));

        // Cập nhâp thuộc tính isDisabled
        publisher.setDisabled(!publisher.isDisabled());

        // Lưu Publisher và chuyển đổi sang PublisherResponse
        Publisher updatedPublisher = publisherRepository.save(publisher);

        return publisherMapper.toPublisherResponse(updatedPublisher);
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDirection) {
        // Adjust page number to start from 0 instead of 1
        int adjustedPage = (page > 0) ? page - 1 : 0;

        // Xử lý trường hợp sortBy có thể null hoặc rỗng
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "id"; // Hoặc bất kỳ trường nào bạn muốn là mặc định
        }

        // Xử lý sortDirection
        Sort.Direction direction = Sort.Direction.fromOptionalString(sortDirection)
                .orElse(Sort.Direction.ASC);

        Sort sort = Sort.by(direction, sortBy);

        return PageRequest.of(adjustedPage, size, sort);
    }

}
