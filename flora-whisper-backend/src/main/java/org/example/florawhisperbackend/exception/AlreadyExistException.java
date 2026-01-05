package org.example.florawhisperbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AlreadyExistException extends ResponseStatusException {

    public AlreadyExistException(String msg) {
        super(HttpStatus.BAD_REQUEST, msg);
    }
}
