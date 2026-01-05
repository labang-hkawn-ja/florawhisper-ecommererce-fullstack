package org.example.florawhisperbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class RegisterAccountTypeError extends ResponseStatusException{
	
	public RegisterAccountTypeError(String msg) {
		super(HttpStatus.BAD_REQUEST,msg);
	}

}
