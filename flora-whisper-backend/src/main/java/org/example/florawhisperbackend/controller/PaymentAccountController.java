package org.example.florawhisperbackend.controller;

import org.example.florawhisperbackend.dto.DepositRequest;
import org.example.florawhisperbackend.dto.FloraDto.*;
import org.example.florawhisperbackend.service.PaymentAccountInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/payment")
public class PaymentAccountController {

	@Autowired
	private PaymentAccountInterface paymentAccountInterface;
	
	@PostMapping("/transfer")
	public ResponseEntity<Double> transfer(@RequestBody TransferRequest req) {
		return ResponseEntity.ok().body(paymentAccountInterface.transferAmount(req.fromAccountNumber(), req.toAccountNumber(), req.amount(), req.username(), req.code()));
	}
	
	@PostMapping("/withDraw")
	public ResponseEntity<Double> withDraw(@RequestBody WithDrawRequest req) {
		return ResponseEntity.ok().body(paymentAccountInterface.withdraw(req.accountNumber(), req.amount(), req.username(), req.code()));
	}

	@PostMapping("/deposit")
	public ResponseEntity<Double> deposit(@RequestBody DepositRequest request) {
		return ResponseEntity.ok().body(paymentAccountInterface.deposit(request.accountNumber(), request.amount(), request.username(), request.code()));
	}

}
