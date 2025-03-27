package com.devteria.identityservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "user_addresses")
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 10)
    String provinceCode;

    @Column(length = 10)
    String districtCode;
    @Column(length = 10)
    String wardCode;

    @Column(length = 100)
    String provinceName;

    @Column(length = 100)
    String districtName;

    @Column(length = 100)
    String wardName;

    String fullAddress;

    String fullName;

    @Column(length = 15)
    String phone;

    @Column(columnDefinition = "TINYINT(1)")
    boolean isDefault;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "userAddress")
    @JsonIgnore
    private List<Order> orders;

}
