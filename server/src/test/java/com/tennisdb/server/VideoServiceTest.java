package com.tennisdb.server;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
// import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tennisdb.server.model.Video;
import com.tennisdb.server.repository.VideoRepository;
import com.tennisdb.server.service.VideoService;

// The @ExtendWith(MockitoExtension.class) annotation registers Mockito with JUnit 5, allowing automatic mock 
// initialization and injection without manually calling MockitoAnnotations.openMocks()
// Used for unit tests
@ExtendWith(MockitoExtension.class)
public class VideoServiceTest {

	@Mock
	Video video;

	// @Spy
	@Mock
	private VideoRepository videoRepository; // Fake repository

	@InjectMocks
	private VideoService videoService; // Real service with fake repository injected. Mockito injects the fake repository into the real service (the @InjectMocks)

	@Test
	public void testGetVideo(){
		// Arrange - Create test data
		Video video1 = new Video(1, "Wimbledon", 2025, "http://example.com/video1", "Alcaraz", "Sinner", "Finals match", "Finals", null);
		Video video2 = new Video(2, "US Open", 2024, "http://example.com/video2", "Djokovic", "Shelton", "Quarterfinals match", "Quarterfinals", null);
		List<Video> expectedVideos = Arrays.asList(video1, video2);

		// Mock the repository (dependency) behavior
		when(videoRepository.findAll()).thenReturn(expectedVideos);
		
		// Act - Call the service method
		// Test the real service (which uses the mocked repository)
		List<Video> actualVideos = videoService.getVideos(); //When you call videoService.getVideos(), it uses the mocked repository
		
		System.out.println("actualVideos contains:");
		// for (int i = 0; i < actualVideos.size(); i++) {
		// 	System.out.println(actualVideos.get(i));
		// }

		for (Video vid: actualVideos) {
			System.out.println(vid);
		}

		// Assert - Verify the result
		assertEquals(expectedVideos.size(), actualVideos.size());
		assertEquals(expectedVideos, actualVideos);
	}

	@Test
	public void testGetVideoById() {
		String youtubeId = "http://example.com/video1";
		Optional<Video> video1 = Optional.of(new Video(1, "Wimbledon", 2025, "http://example.com/video1", "Alcaraz", "Sinner", "Finals match", "Finals", null));
		when(videoRepository.findByYoutubeId(youtubeId)).thenReturn(video1);

		Optional<Video> actual = videoService.getVideoByYoutubeId(youtubeId);

		assertEquals(video1, actual);
	}

	@Test
	public void testCreateVideo(){
		Video video1 = new Video(1, "Wimbledon", 2025, "http://example.com/video1", "Alcaraz", "Sinner", "Finals match", "Finals", null);

		when(videoRepository.save(video1)).thenReturn(video1);
		Video savedVideo = videoService.addNewVideo(video1);

		assertEquals(video1, savedVideo);
		verify(videoRepository, times(1)).save(video1);

	}

	@Test
	public void test_returnsNull() {
		String actual = video.getYoutubeId(); // stub method of mocked video object is null by default
		String expected = null;

		assertEquals(expected, actual); // test passes
	}

	@Test
	public void test_returnsSomethingDifferent() {
		when(video.getYoutubeId()).thenReturn("this other String!");
	}

	@Test
    public void getUrl_throwExceptionJustBecause() {
        when(video.getYoutubeId()).thenThrow(Exception.class);
	}

	// Stubbing void methods requires the use of a different syntax because the when() method does not support 
	// void methods, but the results are the same.
	// Ex: The doTrick() method of Pet class returns void.

	// when(petMock.doTrick()).thenThrow(Exception.class); // compiler error!
	// doThrow(Exception.class).when(petMock).doTrick(); // this works!

	@Test
	public void test() {
		// assertEquals("hello world", "Hello World"); // fails due to lower and uppercase
		assertEquals("Hello World", "Hello World"); // test passes
	}

	
}
