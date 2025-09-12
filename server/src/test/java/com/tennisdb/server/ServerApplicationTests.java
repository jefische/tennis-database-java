package com.tennisdb.server;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.tennisdb.server.model.Video;
import com.tennisdb.server.repository.VideoRepository;

import java.util.List;

// Annotate the class with @SpringBootTest to load the full Spring Boot application context during testing.
// Used for integration testing

@SpringBootTest(classes = ServerApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ServerApplicationTests {

	@Autowired
	private TestRestTemplate restTemplate;

	// Injects real Spring beans from the application context, rather than mocked object.
	// Used in integration tests to wire up actual components (e.g., repositories, services, controllers).
	@Autowired
	private VideoRepository videoRepository; //This injects the real VideoRepository bean, connected to the test database.

	@Test
	void contextLoads() {
		// Verify that the Spring application context loads successfully
	}

	@Test
	void testGetEndpoint(){
		// ResponseEntity<List<Video>> response = restTemplate.getForEntity("/videos", List.class);
		ResponseEntity<List<Video>> response = restTemplate.exchange(
			"/videos", 
			HttpMethod.GET, 
			null, 
			new ParameterizedTypeReference<List<Video>>(){}
		);
		assertEquals(HttpStatus.OK, response.getStatusCode());

	}

	@Test
	void testGetVideo_ByYoutubeId_Endpoint(){
		Video testVideo = new Video(4,"French Open", 2025, "ckbX699wngs", "Carlos Alcaraz", "Jannik Sinner", "Carlos Alcaraz vs Jannik Sinner | Roland-Garros 2025 Final (5hr 53min)", "Finals");
		ResponseEntity<Video> response = restTemplate.exchange(
			"/videos/ckbX699wngs",
			HttpMethod.GET,
			null,
			Video.class
		);
		Video responseVideo = response.getBody();
		assertEquals(responseVideo, testVideo);

	}

	@Test
	void testPostEndpoint() {
		// Create a new video to add via the API
		Video newVideo = new Video("Wimbledon", 2025, "test-youtube-id-123", "Alcaraz", "Sinner", "Finals Title", "The Final Round");
		
		// Set up HTTP headers for JSON content
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		// Wrap the video in an HttpEntity with headers
		HttpEntity<Video> requestEntity = new HttpEntity<>(newVideo, headers);

		// Make the POST request to add the video
		ResponseEntity<List<Video>> response = restTemplate.exchange(
			"/videos/add",
			HttpMethod.POST,
			requestEntity,
			new ParameterizedTypeReference<List<Video>>(){}
		);

		// Verify the response
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertNotNull(response.getBody());
		
		// Verify that the response contains the added video
		List<Video> videos = response.getBody();
		assertNotNull(videos, "Response body should not be null");
		boolean videoFound = videos.stream()
			.anyMatch(video -> "test-youtube-id-123".equals(video.getYoutubeId()));
		assertTrue(videoFound, "The added video should be present in the response");
		
		// Verify the video was actually saved to the database
		Video savedVideo = videoRepository.findByYoutubeId("test-youtube-id-123").orElse(null);
		assertNotNull(savedVideo, "Video should be saved in the database");
		assertEquals("Alcaraz", savedVideo.getPlayer1());
		assertEquals("Sinner", savedVideo.getPlayer2());
		assertEquals("Wimbledon", savedVideo.getTournament());
		assertEquals(Integer.valueOf(2025), savedVideo.getYear());
	}

	@Test
	void testPostEndpoint_DuplicateVideo() {
		// Create and save a video directly to the database first
		Video existingVideo = new Video("US Open", 2024, "existing-youtube-id", "Djokovic", "Medvedev", "Match title", "Match round");
		videoRepository.save(existingVideo);
		
		// Try to add the same video via the API (same youtubeId)
		// Can also test against the H2 DB entries from data.sql for duplication
		Video duplicateVideo = new Video("US Open", 2024, "existing-youtube-id", "Djokovic", "Medvedev", "big title", "semis");
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Video> requestEntity = new HttpEntity<>(duplicateVideo, headers);

		// Make the POST request to add the duplicate video
		ResponseEntity<?> response = restTemplate.exchange(
			"/videos/add",
			HttpMethod.POST,
			requestEntity,
			new ParameterizedTypeReference<Object>(){}
		);

		// Verify that the request returns a 400 Bad Request status for duplicate
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
	}

}
