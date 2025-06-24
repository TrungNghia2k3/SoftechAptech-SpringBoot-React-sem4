package com.ntn.ecommerce.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

import jakarta.mail.MessagingException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.ntn.ecommerce.constant.PredefinedRole;
import com.ntn.ecommerce.dto.request.*;
import com.ntn.ecommerce.dto.response.PageResponse;
import com.ntn.ecommerce.dto.response.UserResponse;
import com.ntn.ecommerce.dto.response.VerifyAccountResponse;
import com.ntn.ecommerce.entity.Role;
import com.ntn.ecommerce.entity.User;
import com.ntn.ecommerce.exception.AppException;
import com.ntn.ecommerce.exception.ErrorCode;
import com.ntn.ecommerce.mapper.UserMapper;
import com.ntn.ecommerce.repository.RoleRepository;
import com.ntn.ecommerce.repository.UserRepository;
import com.ntn.ecommerce.utilities.EmailUtilities;
import com.ntn.ecommerce.utilities.OtpUtilities;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    EmailUtilities emailUtilities;
    OtpUtilities otpUtilities;

    public UserResponse createUser(UserCreationRequest request) {
        // Check if a user with the same username already exists in the repository
        if (userRepository.existsByUsername(request.getUsername()))
            // If the user already exists, throw an exception with an appropriate error code
            throw new AppException(ErrorCode.USER_EXISTED);

        // Convert the UserCreationRequest to a User entity using a mapper
        User user = userMapper.toUser(request);

        // Generate an OTP (One-Time Password) for the user
        String otp = otpUtilities.generateOtp();

        // Send the OTP to the user's email address
        sendOtpEmail(request.getUsername(), otp);

        // Encode the user's password before storing it in the repository
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(false); // Set the user account to inactive initially
        user.setOtp(otp); // Set the generated OTP and the time when it was generated
        user.setOtpGeneratedTime(LocalDateTime.now());
        user.setPoints(0L);

        // Create a set of roles for the user
        HashSet<Role> roles = new HashSet<>();

        // Fetch the predefined role for USER and add it to the roles set
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        // Set the roles for the user
        user.setRoles(roles);

        // Save the user entity to the repository and convert it to a UserResponse DTO
        // Return the UserResponse DTO
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public VerifyAccountResponse verifyAccount(VerifyAccountRequest request) {
        // Fetch the user from the repository using the username from the request
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if the OTP provided in the request matches the stored OTP
        boolean isOtpCorrect = user.getOtp().equals(request.getOtp());

        // Check if the OTP has expired (2 minutes from when it was generated)
        boolean isOtpExpired = Duration.between(user.getOtpGeneratedTime(), LocalDateTime.now())
                        .getSeconds()
                >= (2 * 60);

        // Verify the OTP and its expiration status
        if (isOtpCorrect && !isOtpExpired) {

            user.setActive(true); // If the OTP is correct and not expired, activate the user account

            userRepository.save(user);

            // Return a response indicating that the account is successfully activated
            return VerifyAccountResponse.builder().active(true).build();
        } else if (!isOtpCorrect) {
            // If the OTP is incorrect, throw an exception with an appropriate error code
            throw new AppException(ErrorCode.INCORRECT_OTP);
        } else {
            // If the OTP is expired, throw an exception with an appropriate error code
            throw new AppException(ErrorCode.EXPIRED_OTP);
        }
    }

    public void regenerateOtp(RegenerateOtpRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String otp = otpUtilities.generateOtp();

        sendOtpEmail(request.getUsername(), otp);

        user.setOtp(otp);
        user.setOtpGeneratedTime(LocalDateTime.now());

        userRepository.save(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (!userRepository.existsByUsername(request.getUsername())) throw new AppException(ErrorCode.USER_NOT_EXISTED);
        sendSetPasswordEmail(request.getUsername());
    }

    public void setPassword(String username, SetPasswordRequest request) {
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    private void sendOtpEmail(String username, String otp) {
        try {

            emailUtilities.sendOtpEmail(username, otp);

        } catch (MessagingException e) {

            throw new AppException(ErrorCode.EMAIL_ERROR);
        }
    }

    private void sendSetPasswordEmail(String username) {
        try {
            emailUtilities.sendSetPasswordEmail(username);

        } catch (MessagingException e) {

            throw new AppException(ErrorCode.EMAIL_ERROR);
        }
    }

    public void changePassword(PasswordCreationRequest request) {

        var context = SecurityContextHolder.getContext();

        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Create a PasswordEncoder instance with a strength of 10
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        // Verify that the provided password matches the stored password
        boolean authenticated = passwordEncoder.matches(request.getOldPassword(), user.getPassword());

        // Throw an exception if password incorrect
        if (!authenticated) throw new AppException(ErrorCode.CURRENT_PASSWORD_INCORRECT);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    public UserResponse getMyInfo() {
        // Retrieve the current security context, which contains authentication details
        var context = SecurityContextHolder.getContext();

        // Get the username of the currently authenticated user
        String name = context.getAuthentication().getName();

        // Fetch the user from the repository using the username
        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Convert the User entity to a UserResponse DTO
        var userResponse = userMapper.toUserResponse(user);

        // Determine if the user has a password
        // Set 'noPassword' to true if the user does not have a password
        userResponse.setNoPassword(
                !StringUtils.hasText(user.getPassword())); // Returns information about whether the user has a password?

        // Return the UserResponse DTO
        return userResponse;
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse updateUser(String userId, UserUpdateRequest request) {

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    //    @PreAuthorize("hasAuthority('APROVE_POST')")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> getAllPaginationSortUsers(
            int page, int size, String sortBy, String sortDirection) {
        // Adjust page number to start from 1 instead of 0
        page = (page > 0) ? page - 1 : 0;

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> users = userRepository.findAll(pageable);
        Page<UserResponse> userResponses = users.map(userMapper::toUserResponse);

        return new PageResponse<>(userResponses);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
    }
}
