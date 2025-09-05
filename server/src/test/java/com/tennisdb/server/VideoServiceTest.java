package com.tennisdb.server;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tennisdb.server.Model.Video;
import com.tennisdb.server.Repository.VideoRepository;
import com.tennisdb.server.Service.VideoService;

@ExtendWith(MockitoExtension.class)
public class VideoServiceTest {

	@Mock
	private VideoRepository videoRepository; // Fake repository

	@InjectMocks
	private VideoService videoService; // Real service with fake repository injected. Mockito injects the fake repository into the real service (the @InjectMocks)

	@Test
	public void testGetVideo(){
		// Arrange - Create test data
		Video video1 = new Video(1, "Wimbledon", 2025, "http://example.com/video1", "Alcaraz", "Sinner", "Finals match", "Finals");
		Video video2 = new Video(2, "US Open", 2024, "http://example.com/video2", "Djokovic", "Shelton", "Quarterfinals match", "Quarterfinals");
		List<Video> expectedVideos = Arrays.asList(video1, video2);


		// Mock the repository (dependency) behavior
		when(videoRepository.findAll()).thenReturn(expectedVideos);

		// Act - Call the service method
		// Test the real service (which uses the mocked repository)
		List<Video> actualVideos = videoService.getVideos(); //When you call videoService.getVideos(), it uses the mocked repository

		// Assert - Verify the result
		assertEquals(expectedVideos.size(), actualVideos.size());
		assertEquals(expectedVideos, actualVideos);
	}

	@Test
	public void testCreateVideo(){

	}
	
}
