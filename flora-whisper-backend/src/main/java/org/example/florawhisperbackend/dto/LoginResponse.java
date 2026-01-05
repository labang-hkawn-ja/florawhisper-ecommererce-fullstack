package org.example.florawhisperbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class LoginResponse {

	private String token;
	private String username;
	private String roleName;
	
	public LoginResponse() {
		super();
		
	}
	
}
