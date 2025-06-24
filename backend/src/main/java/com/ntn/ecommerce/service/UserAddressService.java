package com.ntn.ecommerce.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ntn.ecommerce.dto.request.UserAddressRequest;
import com.ntn.ecommerce.dto.response.UserAddressResponse;
import com.ntn.ecommerce.entity.User;
import com.ntn.ecommerce.entity.UserAddress;
import com.ntn.ecommerce.exception.AppException;
import com.ntn.ecommerce.exception.ErrorCode;
import com.ntn.ecommerce.mapper.UserAddressMapper;
import com.ntn.ecommerce.repository.UserAddressRepository;
import com.ntn.ecommerce.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserAddressService {

    UserRepository userRepository;
    UserAddressRepository userAddressRepository;
    UserAddressMapper userAddressMapper;

    public List<UserAddressResponse> getAddressListByUserId(String userId) {
        // Kiểm tra xem người dùng có tồn tại hay không
        userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Lấy danh sách địa chỉ của người dùng, sắp xếp để địa chỉ mặc định xuất hiện đầu tiên
        return userAddressRepository.findByUserId(userId).stream()
                .map(userAddressMapper::toUserAddressResponse)
                .sorted(Comparator.comparing(UserAddressResponse::isDefault).reversed())
                .toList();
    }

    public UserAddressResponse create(String userId, UserAddressRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if the full address already exists
        boolean exists = userAddressRepository.existsByFullAddressAndUserId(request.getFullAddress(), userId);
        if (exists) {
            throw new AppException(ErrorCode.ADDRESS_ALREADY_EXISTS);
        }

        // Kiểm tra xem user có địa chỉ nào chưa
        boolean hasAnyAddress = userAddressRepository.existsByUserId(userId);

        // Nếu yêu cầu có địa chỉ mặc định hoặc người dùng chưa có địa chỉ nào, setDefault = true
        if (request.isDefault() || !hasAnyAddress) {
            userAddressRepository.updateAllAddressesToNonDefault(userId);
            request.setDefault(true); // Đảm bảo rằng địa chỉ này là mặc định
        }

        UserAddress address = userAddressMapper.toUserAddress(request);
        address.setUser(user);

        // Đặt giá trị isDefault từ yêu cầu (đã được cập nhật)
        address.setDefault(request.isDefault());

        UserAddress savedAddress = userAddressRepository.save(address);
        return userAddressMapper.toUserAddressResponse(savedAddress);
    }

    public UserAddressResponse edit(String userId, Long id, UserAddressRequest request) {
        // Tìm kiếm người dùng dựa trên userId
        userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Tìm kiếm địa chỉ cần sửa dựa trên id
        UserAddress address =
                userAddressRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Kiểm tra xem địa chỉ mới có trùng với địa chỉ đã tồn tại không
        boolean exists = userAddressRepository.existsByFullAddressAndUserId(request.getFullAddress(), userId);
        if (exists && !address.getFullAddress().equals(request.getFullAddress())) {
            throw new AppException(ErrorCode.ADDRESS_ALREADY_EXISTS);
        }

        // Nếu giá trị default trong request khác với giá trị default của address hiện tại
        if (request.isDefault() != address.isDefault()) {
            // Nếu địa chỉ mới được đánh dấu là mặc định, cập nhật tất cả các địa chỉ khác không còn là mặc định
            if (request.isDefault()) {
                userAddressRepository.updateAllAddressesToNonDefault(userId);
            }
            // Cập nhật trường default của address hiện tại
            address.setDefault(request.isDefault());
        }

        // Ánh xạ các trường từ request sang đối tượng address hiện có
        userAddressMapper.updateUserAddressFromRequest(request, address);

        // Lưu địa chỉ đã được cập nhật
        UserAddress updatedAddress = userAddressRepository.save(address);

        // Chuyển đổi đối tượng UserAddress đã được cập nhật thành UserAddressResponse và trả về
        return userAddressMapper.toUserAddressResponse(updatedAddress);
    }
}
