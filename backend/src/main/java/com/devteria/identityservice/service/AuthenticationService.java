package com.devteria.identityservice.service;

import com.devteria.identityservice.constant.PredefinedRole;
import com.devteria.identityservice.dto.request.*;
import com.devteria.identityservice.dto.response.AuthenticationResponse;
import com.devteria.identityservice.dto.response.IntrospectResponse;
import com.devteria.identityservice.entity.InvalidatedToken;
import com.devteria.identityservice.entity.Role;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.repository.InvalidatedTokenRepository;
import com.devteria.identityservice.repository.UserRepository;
import com.devteria.identityservice.repository.httpclient.OutboundIdentityClient;
import com.devteria.identityservice.repository.httpclient.OutboundUserClient;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    @NonFinal
    protected final String GRANT_TYPE = "authorization_code";
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    OutboundIdentityClient outboundIdentityClient;
    OutboundUserClient outboundUserClient;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;
    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;
    @NonFinal
    @Value("${outbound.identity.client-id}")
    protected String CLIENT_ID;
    @NonFinal
    @Value("${outbound.identity.client-secret}")
    protected String CLIENT_SECRET;
    @NonFinal
    @Value("${outbound.identity.redirect-uri}")
    protected String REDIRECT_URI;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        // Extract the token from the request object
        var token = request.getToken();
        boolean isValid = true; // Initialize the validity flag  true

        try {
            // Attempt to verify the token; false indicates some specific verification option
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false; // If verification fails, set the validity flag to false
        }

        // Build and return an IntrospectResponse with the validity status
        return IntrospectResponse.builder().valid(isValid).build();
    }

    public AuthenticationResponse outboundAuthenticate(String code) {

        // Call api from Google to exchange the authorization code for an access token
        var response = outboundIdentityClient.exchangeToken(ExchangeTokenRequest.builder()
                .code(code)
                .clientId(CLIENT_ID)
                .clientSecret(CLIENT_SECRET)
                .redirectUri(REDIRECT_URI)
                .grantType(GRANT_TYPE)
                .build());

        log.info("TOKEN RESPONSE {}", response);

        // Get user info from Google using the obtained access token
        var userInfo = outboundUserClient.getUserInfo("json", response.getAccessToken());

        log.info("User Info {}", userInfo);

        // Initialize a set of roles and add the predefined user role
        Set<Role> roles = new HashSet<>();
        roles.add(Role.builder().name(PredefinedRole.USER_ROLE).build());

        // Onboard the user based on the access token
        // If the user is not found in the repository, save a new user
        var user = userRepository
                .findByUsername(userInfo.getEmail())
                .orElseGet(() -> userRepository.save(User.builder()
                        .username(userInfo.getEmail())
                        .firstName(userInfo.getGivenName())
                        .lastName(userInfo.getFamilyName())
                        .active(true)
                        .roles(roles)
                        .points(0L)
                        .build()));

        // Generate an authentication token for the user
        var token = generateToken(user);

        // Map user details to AuthenticationResponse and return the response
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Create a PasswordEncoder instance with a strength of 10
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        // Retrieve the user from the repository by username or throw an exception if not found
        var user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        // Verify that the provided password matches the stored password
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        // Throw an exception if authentication fail
        if (!authenticated) throw new AppException(ErrorCode.INVALID_CREDENTIALS);

        // Check if the user's account is active
        boolean active = user.isActive();

        // Throw an exception if the user's account is not active
        if (!active) throw new AppException(ErrorCode.NOT_VERIFY);

        // Generate an authentication token for the user
        var token = generateToken(user);

        // Map user details to AuthenticationResponse and return the response

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            // Verify the provided token and get the signed token, with `true` indicating a specific verification option
            var signToken = verifyToken(request.getToken(), true);

            // Extract the JWT ID (jit) and the expiration time from the token's claims
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            // Create an InvalidatedToken object with the extracted JWT ID and expiration time
            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder()
                            .id(jit)
                            .expiryTime(expiryTime)
                            .build();

            // Save the invalidated token in the repository
            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            // Log information if the token has already expired and rethrow an exception indicating the expired token

            log.info("Token already expired");

            throw new AppException(ErrorCode.EXPIRED_TOKEN);
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        // Verify the provided token and get the signed JWT, with `true` indicating a specific verification option
        var signedJWT = verifyToken(request.getToken(), true);

        // Extract the JWT ID (jit) and the expiration time from the token's claims
        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        // Create an InvalidatedToken object with the extracted JWT ID and expiration time
        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder()
                        .id(jit)
                        .expiryTime(expiryTime)
                        .build();

        // Save the invalidated token in the repository to mark it as invalidated
        invalidatedTokenRepository.save(invalidatedToken);

        // Extract the username from the token's claims
        var username = signedJWT.getJWTClaimsSet().getSubject();

        // Retrieve the user from the repository by username or throw an exception if not found
        var user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        // Generate a new authentication token for the user
        var token = generateToken(user);

        return AuthenticationResponse
                .builder()
                .token(token).authenticated(true)
                .build();
    }

    private String generateToken(User user) {
        // Create a JWSHeader with the HS512 algorithm
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // Build the JWT claims set with subject, issuer, issue time, expiration time, JWT ID, and user scope
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("devteria.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        // Convert the JWT claims set to a JSON object and create a Payload
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        // Create a JWSObject with the header and payload
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            // Sign the JWS object using the SIGNER_KEY
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));

            // Serialize the JWS object to a compact form and return it as the token
            return jwsObject.serialize();
        } catch (JOSEException e) {

            // Log an error message and throw an AppException if token creation fails
            log.error("Cannot create token", e);
            throw new AppException(ErrorCode.FAILED_CREATE_TOKEN);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {

        // Create a JWSVerifier using the SIGNER_KEY
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        // Parse the provided token into a SignedJWT object
        SignedJWT signedJWT = SignedJWT.parse(token);

        // Determine the expiry time based on whether the token is being refreshed
        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        // Verify the token's signature using the verifier
        var verified = signedJWT.verify(verifier);

        // Check if the token is verified and not expired; if not, throw an authentication exception
        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        // Check if the token has been invalidated; if so, throw an authentication exception
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        // Return the verified SignedJWT object
        return signedJWT;
    }


    private String buildScope(User user) {
        // Create a StringJoiner with a space as the delimiter
        StringJoiner stringJoiner = new StringJoiner(" ");

        // Check if the user has any roles
        if (!CollectionUtils.isEmpty(user.getRoles()))

            // Iterate over each role
            user.getRoles().forEach(role -> {

                // Add the role name prefixed with "ROLE_" to the stringJoiner
                stringJoiner.add("ROLE_" + role.getName());

                // Check if the role has any permissions
                if (!CollectionUtils.isEmpty(role.getPermissions()))

                    // Iterate over each permission and add its name to the stringJoiner
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });

        // Convert the joined roles and permissions to a string and return it
        return stringJoiner.toString();
    }
}
