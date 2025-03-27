package com.devteria.identityservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 50)
    String vnp_TmnCode;

    Long vnp_Amount;

    @Column(length = 20)
    String vnp_BankCode;

    @Column(length = 50)
    String vnp_BankTranNo;

    @Column(length = 20)
    String vnp_CardType;

    LocalDateTime vnp_PayDate;

    String vnp_OrderInfo;

    @Column(length = 50)
    String vnp_TransactionNo;

    @Column(length = 10)
    String vnp_ResponseCode;

    @Column(length = 50)
    String vnp_TxnRef;

    @Column(length = 20)
    String vnp_TransactionStatus;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    User user;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    Order order; // Each payment is associated with one order
}
