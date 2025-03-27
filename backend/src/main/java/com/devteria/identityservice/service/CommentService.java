package com.devteria.identityservice.service;

import com.devteria.identityservice.constant.OrderStatus;
import com.devteria.identityservice.dto.request.AdminResponseRequest;
import com.devteria.identityservice.dto.request.CommentRequest;
import com.devteria.identityservice.dto.response.CategoryResponse;
import com.devteria.identityservice.dto.response.CommentResponse;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.entity.CartProduct;
import com.devteria.identityservice.entity.Category;
import com.devteria.identityservice.entity.Comment;
import com.devteria.identityservice.entity.Order;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.CommentMapper;
import com.devteria.identityservice.repository.CommentRepository;
import com.devteria.identityservice.repository.OrderRepository;
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

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    CommentRepository commentRepository;
    OrderRepository oderRepository;
    CommentMapper commentMapper;
    ProductService productService;
    UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<CommentResponse> getAllComments(int page, int size, String sortBy, String sortDirection) {
        // Adjust page number to start from 1 instead of 0
        page = (page > 0) ? page - 1 : 0;

        // Determine sorting direction
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // Create pageable object with page, size, and sort
        Pageable pageable = PageRequest.of(page, size, sort);

        // Fetch all comments
        Page<Comment> comments = commentRepository.findAll(pageable);

        // Map comments to CommentResponse
        Page<CommentResponse> commentResponses = comments.map(commentMapper::toCommentResponse);

        // Return as PageResponse
        return new PageResponse<>(commentResponses);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CommentResponse getById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        // Map to response and return
        return commentMapper.toCommentResponse(comment);
    }


    public List<CommentResponse> getAllCommentAndRatingByProductId(String productId) {

        // Lấy tất cả bình luận cho sản phẩm theo productId
        List<Comment> comments = commentRepository.findByProductId(productId);

        // Chuyển đổi danh sách bình luận thành danh sách CommentResponse
        return comments.stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('USER')")
    public boolean checkUserPurchasedProduct(String userId, String productId) {

        // Tìm đơn hàng của người dùng có chứa sản phẩm cụ thể
        List<Order> orders = oderRepository.findByUserId(userId);

        // Kiểm tra từng đơn hàng
        for (Order order : orders) {
            // Kiểm tra trạng thái đơn hàng
            if (OrderStatus.DELIVERED.equals(order.getOrderStatus())) {
                // Kiểm tra xem sản phẩm có trong giỏ hàng không
                for (CartProduct cartProduct : order.getCart().getCartProducts()) {
                    if (cartProduct.getProduct().getId().equals(productId)) {
                        return true; // Người dùng đã mua và nhận sản phẩm
                    }
                }
            }
        }

        // Nếu không tìm thấy, trả về false
        return false;
    }

    @PreAuthorize("hasRole('USER')")
    public CommentResponse addCommentAndRating(String userId, String productId, CommentRequest request) {

        // Kiểm tra xem người dùng đã mua sản phẩm chưa
        if (!checkUserPurchasedProduct(userId, productId)) {
            throw new AppException(ErrorCode.USER_HAS_NOT_PURCHASE);
        }   

        // Xác định thời gian bắt đầu và kết thúc của ngày hiện tại
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        // Kiểm tra xem người dùng đã gửi comment trong ngày hôm nay chưa
        Long commentCount = commentRepository.countCommentsByUserAndProductInDay(userId, productId, startOfDay, endOfDay);
        if (commentCount > 0) {
            throw new AppException(ErrorCode.USER_ALREADY_COMMENTED_TODAY);
        }

        // Tạo đối tượng Comment từ request
        Comment comment = commentMapper.toComment(request);
        comment.setUser(userService.getUserById(userId));
        comment.setProduct(productService.getProductById(productId));

        // Lưu comment vào cơ sở dữ liệu
        commentRepository.save(comment);

        // Trả về CommentResponse
        return commentMapper.toCommentResponse(comment);
    }


    @PreAuthorize("hasRole('USER')")
    public CommentResponse editCommentAndRating(Long id, CommentRequest request) {

        // Tìm comment theo commentId
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        // Cập nhật thông tin bình luận
        existingComment.setContent(request.getContent());
        existingComment.setStars(request.getStars());
        existingComment.setCreatedDate(LocalDateTime.now());

        // Lưu comment đã chỉnh sửa vào cơ sở dữ liệu
        commentRepository.save(existingComment);

        // Trả về CommentResponse
        return commentMapper.toCommentResponse(existingComment);
    }

    @PreAuthorize("hasRole('USER')")
    public void removeCommentAndRating(Long id) {
        // Tìm comment theo commentId
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        // Xóa comment khỏi cơ sở dữ liệu
        commentRepository.delete(existingComment);
    }

    // API để admin phản hồi comment
    @PreAuthorize("hasRole('ADMIN')")
    public CommentResponse addAdminResponse(Long id, AdminResponseRequest request) {
        // Tìm comment theo id
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        // Kiểm tra xem người dùng đã có comment chưa
        if (comment.getContent() == null || comment.getContent().isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_COMMENT);
        }

        // Thêm phản hồi của admin
        comment.setAdminResponse(request.getAdminResponse());

        // Lưu comment đã cập nhật
        Comment updatedComment = commentRepository.save(comment);

        // Chuyển đổi đối tượng Comment sang CommentResponse và trả về
        return commentMapper.toCommentResponse(updatedComment);
    }

}
