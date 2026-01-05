package org.example.florawhisperbackend.exception;

import java.time.LocalDateTime;

public class ApiError {

	private int statusCode;
	private String message;
	private LocalDateTime localDateTime;

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public LocalDateTime getLocalDateTime() {
		return localDateTime;
	}

	public void setLocalDateTime(LocalDateTime localDateTime) {
		this.localDateTime = localDateTime;
	}

	public ApiError() {
		super();
	}

	public ApiError(int statusCode, String message, LocalDateTime localDateTime) {
		super();
		this.statusCode = statusCode;
		this.message = message;
		this.localDateTime = localDateTime;
	}

}
