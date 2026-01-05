package org.example.florawhisperbackend.service;

import java.math.BigDecimal;
import java.util.Optional;


import org.example.florawhisperbackend.dao.OtpDao;
import org.example.florawhisperbackend.dao.PaymentAccountDao;
import org.example.florawhisperbackend.entity.Otp;
import org.example.florawhisperbackend.entity.PaymentAccount;
import org.example.florawhisperbackend.exception.NotFoundException;
import org.example.florawhisperbackend.exception.InsufficientException;
import org.example.florawhisperbackend.exception.SecurityCodeInvalidException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import jakarta.transaction.Transactional;


@Service
public class PaymentAccountInterfaceImpl implements PaymentAccountInterface {

	@Autowired
	private PaymentAccountDao paymentAccountDao;

    @Autowired
    private OtpDao otpDao;

	@Override
	public double deposit(String accountNumber, double amount, String username, String code) {
		boolean response = toGrantedSecurityCode(username, code);

		if (response) {

			if(isAccountExist(accountNumber, username)) {
				PaymentAccount account = getAccount(accountNumber);

				/* account.getAmount().add(BigDecimal.valueOf(amount)); */
				if (amount >= 0) {
					account.setAmount(account.getAmount().add(BigDecimal.valueOf(amount)));
				}
				else {
					throw new IllegalArgumentException("Amount must be greater than zero");
				}
				return updateAccount(account);
			}

			throw new NotFoundException(accountNumber);

		} else {
			throw new SecurityCodeInvalidException(code);
		}
	}

	@Override
	public double withdraw(String accountNumber, double amount, String username, String code) {
		boolean response = toGrantedSecurityCode(username, code);

		if (response) {
			if(isAccountExist(accountNumber, username)) {
				PaymentAccount account = getAccount(accountNumber);

				if (amount >= 0) {
					if ( account.getAmount().doubleValue() >= amount ) {
						account.setAmount(account.getAmount().subtract(BigDecimal.valueOf(amount)));
						return updateAccount(account);
					} else {
						throw new InsufficientException("Your Account Amount is insufficient!");
					}
				} else {
					throw new IllegalArgumentException("Amount must be greater than zero");
				}

			} else {
				throw new NotFoundException(accountNumber);
			}
		} else {
			throw new SecurityCodeInvalidException(code);
		}

	}

	private boolean toGrantedSecurityCode(String username, String code) {
        Optional<Otp> otpOptional = otpDao.findByCodeAndUsername(code, username);
        return otpOptional.isPresent() ? true : false;
	}

	@Override @Transactional
	public double transferAmount(String fromAccountNumber, String toAccountNumber, double amount, String username, String code) {

		withdraw(fromAccountNumber, amount, username, code);

		if (paymentAccountDao.findByAccountNumber(toAccountNumber).isPresent()) {
			PaymentAccount payment = getAccount(toAccountNumber);
			payment.setAmount(payment.getAmount().add(BigDecimal.valueOf(amount)));
			paymentAccountDao.saveAndFlush(payment);
			return paymentAccountDao.findByAccountNumber(fromAccountNumber).get().getAmount().doubleValue();
		}

		throw new NotFoundException("Account %s not found".formatted(toAccountNumber));
		//deposit(toAccountNumber, amount, username, code);

	}

	private double updateAccount(PaymentAccount account) {
		PaymentAccount  updateAccount = paymentAccountDao.saveAndFlush(account);
		return updateAccount.getAmount().doubleValue();
	}

	private boolean isAccountExist(String accountNumber, String name) {
		return paymentAccountDao.findByAccountNumberAndUsername(accountNumber, name).isPresent();
	}

	private PaymentAccount getAccount(String accountNumber) {
		return paymentAccountDao.findByAccountNumber(accountNumber).get();
	}





}
