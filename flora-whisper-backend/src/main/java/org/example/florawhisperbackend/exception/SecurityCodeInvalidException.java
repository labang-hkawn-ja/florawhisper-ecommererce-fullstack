package org.example.florawhisperbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SecurityCodeInvalidException extends ResponseStatusException {

	public SecurityCodeInvalidException(String code) {
		super(HttpStatus.UNAUTHORIZED, code + "is invalid!");
	}

	
}
