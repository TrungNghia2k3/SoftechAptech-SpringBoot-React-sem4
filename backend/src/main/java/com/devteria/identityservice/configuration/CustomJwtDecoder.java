package com.devteria.identityservice.configuration;

import com.devteria.identityservice.dto.request.IntrospectRequest;
import com.devteria.identityservice.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    @Value("${jwt.signerKey}")
    private String signerKey;

    @Autowired
    private AuthenticationService authenticationService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {

        try {

            // Call the introspect method of authenticationService to verify the token
            var response = authenticationService.introspect(
                    IntrospectRequest.builder().token(token).build());

            // If the token is not valid, throw a JwtException
            if (!response.isValid()) throw new JwtException("Token invalid");
        } catch (JOSEException | ParseException e) {

            // If there is an exception during introspection, throw a JwtException with the error message
            throw new JwtException(e.getMessage());
        }

        // Initialize nimbusJwtDecoder if it is null
        if (Objects.isNull(nimbusJwtDecoder)) {

            // Create a SecretKeySpec using the signerKey and HS512 algorithm
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");

            // Build a NimbusJwtDecoder with the secret key and HS512 algorithm
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        // Use the nimbusJwtDecoder to decode the token and return the decoded JWT
        return nimbusJwtDecoder.decode(token);
    }
}
