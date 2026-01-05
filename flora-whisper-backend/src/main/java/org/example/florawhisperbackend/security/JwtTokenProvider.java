package org.example.florawhisperbackend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider implements InitializingBean {

	@Value("${app.jwt.secret:defaultSecretKeyThatIsLongEnoughForHS512Algorithm}")
	private String jwtSecret;

	@Value("${app.jwt.expiration.milliseconds:86400000}") // 24 hours default
	private long jwtExpiration;

	private SecretKey key;

	public String getUserNameFromToken(String token) {
		Claims claims = Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
		return claims.getSubject();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parser()
					.verifyWith(key)
					.build()
					.parseSignedClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public String generateToken(Authentication authentication) {
		String username = authentication.getName();
		Date currentDate = new Date();
		Date expirationDate = new Date(currentDate.getTime() + jwtExpiration);

		return Jwts.builder()
				.subject(username)
				.issuedAt(currentDate)
				.expiration(expirationDate)
				.signWith(key, SIG.HS256) // Explicitly specify the algorithm
				.compact();
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		// Ensure the secret key is long enough (at least 32 characters for HS256)
		if (jwtSecret == null || jwtSecret.length() < 32) {
			jwtSecret = "defaultSecretKeyThatIsLongEnoughForHS512Algorithm123";
		}
		this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
	}
}