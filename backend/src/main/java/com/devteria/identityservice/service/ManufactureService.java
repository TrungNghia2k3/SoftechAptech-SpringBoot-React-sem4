package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.ManufactureRequest;
import com.devteria.identityservice.dto.response.FeedbackResponse;
import com.devteria.identityservice.dto.response.ManufactureResponse;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.entity.Feedback;
import com.devteria.identityservice.entity.Manufacture;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.ManufactureMapper;
import com.devteria.identityservice.repository.ManufactureRepository;
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
public class ManufactureService {

    ManufactureRepository manufactureRepository;
    ManufactureMapper manufactureMapper;

    public List<ManufactureResponse> getAll() {
        return manufactureRepository.findAll()
                .stream()
                .map(manufactureMapper::toManufactureResponse)
                .toList();
    }
    @PreAuthorize("hasRole('ADMIN')")
    public ManufactureResponse createManufacture(ManufactureRequest request) {
        if (manufactureRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.MANUFACTURE_NAME_EXISTED);
        }
        Manufacture manufacture = manufactureMapper.toManufacture(request);
        Manufacture savedManufacture = manufactureRepository.save(manufacture);
        return manufactureMapper.toManufactureResponse(savedManufacture);
    }


    @PreAuthorize("hasRole('ADMIN')")
    public ManufactureResponse updateManufacture(Long id, ManufactureRequest request) {
        Optional<Manufacture> existingManufactureOpt = manufactureRepository.findById(id);
        if (existingManufactureOpt.isPresent()) {
            Manufacture existingManufacture = existingManufactureOpt.get();

            if (!existingManufacture.getName().equals(request.getName()) && manufactureRepository.existsByName(request.getName())) {
                throw new AppException(ErrorCode.MANUFACTURE_NAME_EXISTED);
            }

            manufactureMapper.updateManufacture(existingManufacture, request);

            existingManufacture = manufactureRepository.save(existingManufacture);
            return manufactureMapper.toManufactureResponse(existingManufacture);
        } else {
            throw new AppException(ErrorCode.MANUFACTURE_NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteManufacture(Long id) {
        if (!manufactureRepository.existsById(id)) {
            throw new AppException(ErrorCode.MANUFACTURE_NOT_FOUND);
        }
        manufactureRepository.deleteById(id);
    }

    public ManufactureResponse getManufactureById(Long id) {
        Manufacture manufacture = manufactureRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MANUFACTURE_NOT_FOUND));
        return manufactureMapper.toManufactureResponse(manufacture);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<ManufactureResponse> getManufactures(int page, int size, String sortBy, String sortDirection) {
        // Adjust page number to start from 1 instead of 0
        page = (page > 0) ? page - 1 : 0;

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Manufacture> manufacs = manufactureRepository.findAll(pageable);
        Page<ManufactureResponse> manufactureResponses = manufacs.map(manufactureMapper::toManufactureResponse);

        return new PageResponse<>(manufactureResponses);
    }
}
