package org.example.florawhisperbackend.dao;

import java.util.Optional;

import org.example.florawhisperbackend.entity.PaymentAccount;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentAccountDao extends JpaRepository<PaymentAccount, Long> {

	Optional<PaymentAccount> findByAccountNumber(String accountNumber);
	
	Optional<PaymentAccount> findByAccountNumberAndUsername(String accountNumber, String username);
}
