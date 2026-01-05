package org.example.florawhisperbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InsufficientException extends ResponseStatusException {

	public InsufficientException(String msg) {
		super(HttpStatus.BAD_REQUEST, msg);
	}
}
