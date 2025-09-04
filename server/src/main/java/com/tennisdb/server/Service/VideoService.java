package com.tennisdb.server.Service;

// import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tennisdb.server.Repository.VideoRepository;
import com.tennisdb.server.Model.Video;

@Service
public class VideoService {
	
	private VideoRepository videoRepository;

	public VideoService(VideoRepository videoRepository) {
		this.videoRepository = videoRepository;
	}

	public List<Video> getVideos() {
		// Video video1 = new Video(1, "http://example.com/video1");
		// Video video2 = new Video(2, "http://example.com/video2");
		// Video video3 = new Video(2, "http://example.com/video2");
		// List<Video> result = Arrays.asList(video1, video2, video3);
		// return result;
		return videoRepository.findAll();
	}
}
