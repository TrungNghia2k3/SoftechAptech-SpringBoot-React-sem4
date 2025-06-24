package com.ntn.ecommerce.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(length = 50)
    String username;

    @Column(length = 100)
    @JsonIgnore
    String password;

    @Column(length = 50)
    String firstName;

    @Column(length = 50)
    String lastName;

    LocalDate dob;

    @Column(length = 15)
    String phone;

    @Column(length = 15)
    String otp;

    LocalDateTime otpGeneratedTime;

    @Column(columnDefinition = "TINYINT(1)")
    boolean active;

    Long points; // new field

    @ManyToMany
    @JsonIgnore
    Set<Role> roles;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<UserAddress> addresses;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<Cart> carts;
}
