package org.example.florawhisperbackend.dao;

import org.example.florawhisperbackend.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutDao extends JpaRepository<Checkout, Long> {
    List<Checkout> findByCustomerIdOrderByOrderDateDesc(long id);

    List<Checkout> findAllByOrderByOrderDateDesc();
}
