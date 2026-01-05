package org.example.florawhisperbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NotFoundException extends ResponseStatusException{

	public NotFoundException(String accountNumber) {
		super(HttpStatus.BAD_REQUEST, accountNumber);
	}


}
