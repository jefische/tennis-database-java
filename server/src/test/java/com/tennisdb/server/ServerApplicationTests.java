package com.tennisdb.server;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import com.tennisdb.server.Model.Video;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class ServerApplicationTests {

	@Mock
	Video video;

	@Test
	void contextLoads() {
	}

	@Test
	public void test() {
		assertEquals("hello world", "Hello World");
	}

	@Test
	public void test_returnsNull() {
		String actual = video.getYoutubeId(); // stub method is null?
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
    
}
