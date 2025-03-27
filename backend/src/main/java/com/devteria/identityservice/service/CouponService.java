package com.devteria.identityservice.service;

import com.devteria.identityservice.constant.CouponType;
import com.devteria.identityservice.dto.request.CouponRequest;
import com.devteria.identityservice.dto.response.CouponResponse;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.dto.response.UserCouponsResponse;
import com.devteria.identityservice.entity.Coupon;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.entity.UserCoupons;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.CouponMapper;
import com.devteria.identityservice.mapper.UserCouponsMapper;
import com.devteria.identityservice.repository.CouponRepository;
import com.devteria.identityservice.repository.UserCouponsRepository;
import com.devteria.identityservice.repository.UserRepository;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CouponService {
    CouponRepository couponRepository;
    UserRepository userRepository;
    UserCouponsRepository userCouponsRepository;
    CouponMapper couponMapper;
    UserCouponsMapper userCouponsMapper;

    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll()
                .stream()
                .map(couponMapper::toCouponResponse)
                .toList();
    }

    public PageResponse<CouponResponse> getCoupons(int page, int size, String sortBy, String sortDirection) {
        page = (page > 0) ? page - 1 : 0;

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Coupon> coupons = couponRepository.findAll(pageable);

        Page<CouponResponse> couponResponse = coupons.map(couponMapper::toCouponResponse);

        return new PageResponse<>(couponResponse);
    }

    public CouponResponse getCoupon(String id) {
        return couponMapper.toCouponResponse(couponRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CouponResponse createCoupon(CouponRequest request) {

        //Kiểm tra id có tồn tại chưa
        if (couponRepository.existsById(request.getId())) {
            // Ném ngoại lệ nếu id đã tồn tại
            throw new AppException(ErrorCode.COUPON_ID_EXIST);
        }

        //Kiểm tra type FREESHIP có tồn tại chưa
        if (CouponType.FREESHIP.equals(request.getType()) && couponRepository.existsByType(CouponType.FREESHIP)) {
            // Ném ngoại lệ nếu một coupon với type FREESHIP đã tồn tại trong cơ sở dữ liệu
            throw new AppException(ErrorCode.FREE_SHIP_COUPON_TYPE_EXIST);
        }

        // Nếu id & type không tồn tại, tiến hành tạo coupon mới
        Coupon coupon = couponMapper.toCoupon(request);

        coupon.setType(request.getType().toUpperCase());

        log.info("Coupon ID before save: {}", coupon.getId());

        Coupon saveCoupon = couponRepository.save(coupon);

        return couponMapper.toCouponResponse(saveCoupon);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CouponResponse updateCoupon(String id, CouponRequest request) {

        // Find the existing coupon by ID
        Coupon existingCoupon = couponRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        // Check if the coupon type is being changed to FREESHIP
        if (CouponType.FREESHIP.equals(request.getType())) {
            // Check if there is already a coupon with type FREESHIP in the database
            if (!CouponType.FREESHIP.equals(existingCoupon.getType())
                    && couponRepository.existsByType(CouponType.FREESHIP)) {
                // Throw an exception if a different coupon with type FREESHIP already exists
                throw new AppException(ErrorCode.FREE_SHIP_COUPON_TYPE_EXIST);
            }
        }

        // Update the existing coupon with new data
        couponMapper.updateCoupon(existingCoupon, request);

        // Ensure the coupon type is set to uppercase
        existingCoupon.setType(request.getType().toUpperCase());

        // Save the updated coupon and return the response
        return couponMapper.toCouponResponse(couponRepository.save(existingCoupon));
    }


    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCoupon(String id) {
        couponRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('USER')")
    public UserCouponsResponse redeemCoupon(String couponId, String userId) {

        // 1. Tìm coupon có tồn tại không?
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        // 2. Tìm user có tồn tại không?
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 3. Check if user has enough points to redeem the coupon
        Long pointCost = coupon.getPointCost(); // Assume pointCost is a field in Coupon entity

        if (user.getPoints() == null || user.getPoints() < pointCost) {
            throw new AppException(ErrorCode.INSUFFICIENT_POINTS);
        }

        // 4. Handle the UserCoupons creation or update

        // Check if the user already has this coupon
        UserCoupons userCoupon = userCouponsRepository.findByUserAndCoupon(user, coupon)
                .orElse(null);

        if (userCoupon == null) {
            // 4.1 Người dùng chưa có coupon id này -> tạo mới và quantity = 1
            userCoupon = new UserCoupons();
            userCoupon.setUser(user);
            userCoupon.setCoupon(coupon);
            userCoupon.setQuantity(1);
        } else {
            // 4.2 Người dùng đã có coupon id này -> tăng số lượng lên 1
            userCoupon.setQuantity(userCoupon.getQuantity() + 1);
        }

        // 5. Save the UserCoupons entity
        userCouponsRepository.save(userCoupon);

        // 6. Trừ điểm của user: userPoints = userPoints - pointCost
        user.setPoints(user.getPoints() - pointCost);

        // Update the user's points in the database
        userRepository.save(user);

        // 7. Convert to UserCouponsResponse and return the response
        return userCouponsMapper.toUserCouponsResponse(userCoupon);
    }

    @PreAuthorize("hasRole('USER')")
    public List<UserCouponsResponse> getAllCouponsByUserId(String userId) {

        // Retrieve all UserCoupons by userId
        List<UserCoupons> userCouponsList = userCouponsRepository.findAllByUserId(userId);

        // Map UserCoupons entities to UserCouponsResponse DTOs
        return userCouponsList.stream()
                .map(userCouponsMapper::toUserCouponsResponse)
                .collect(Collectors.toList());
    }


    @PreAuthorize("hasRole('USER')")
    public void applyCoupons(String userId, List<String> couponIds) {

        // 1. Tìm user có tồn tại không?
        userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Tìm coupons có tồn tại không?
        List<Coupon> coupons = couponRepository.findAllById(couponIds);
        if (coupons.size() != couponIds.size()) {
            throw new AppException(ErrorCode.COUPON_NOT_FOUND);
        }

        // 3. Tìm các UserCoupons tương ứng
        List<UserCoupons> userCoupons = userCouponsRepository.findByUserIdAndCouponIdIn(userId, couponIds);

        // 4. Cập nhật số lượng hoặc xóa coupon
        for (UserCoupons userCoupon : userCoupons) {
            userCoupon.setQuantity(userCoupon.getQuantity() - 1);

            if (userCoupon.getQuantity() == 0) {
                userCouponsRepository.delete(userCoupon);
            } else {
                userCouponsRepository.save(userCoupon);
            }
        }
    }
}

