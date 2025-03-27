package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.FeedbackRequest;
import com.devteria.identityservice.dto.response.FeedbackResponse;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.entity.Feedback;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.FeedbackMapper;
import com.devteria.identityservice.repository.FeedbackRepository;
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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j

public class FeedbackService {
    FeedbackRepository feedbackRepository;
    FeedbackMapper feedbackMapper;

    public FeedbackResponse createFeedback(FeedbackRequest request) {
        Feedback feedback = feedbackMapper.toFeedback(request);// lấy reqquest về
        Feedback savedFeedback = feedbackRepository.save(feedback);// lưu vào DB
        return feedbackMapper.toFeedbackResponse(savedFeedback);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deteleFeedback(Long feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new AppException(ErrorCode.FEEDBACK_NOT_FOUND);
        }
        feedbackRepository.deleteById(feedbackId);
    }


    @PreAuthorize("hasRole('ADMIN')")
    public List<FeedbackResponse> getAll() {
        return feedbackRepository.findAll()
                .stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }


    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<FeedbackResponse> getFeedbacks(int page, int size, String sortBy, String sortDirection) {
        // Adjust page number to start from 1 instead of 0
        page = (page > 0) ? page - 1 : 0;

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Feedback> feedbacks = feedbackRepository.findAll(pageable);
        Page<FeedbackResponse> feedbackResponses = feedbacks.map(feedbackMapper::toFeedbackResponse);

        return new PageResponse<>(feedbackResponses);
    }
}
