package org.example.florawhisperbackend.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler({
			NotFoundException.class, InsufficientException.class,
			SecurityCodeInvalidException.class, RegisterAccountTypeError.class,
			AlreadyExistException.class
	})
	public ResponseEntity<Object> handleError(Exception ex, WebRequest req) throws Exception {
		return handleExceptionInternal(ex, message(ex), new HttpHeaders(), HttpStatus.BAD_REQUEST, req);
	}
	
	private ApiError message(Exception ex) {
		return new ApiError(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
	}
}
