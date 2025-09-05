package com.tennisdb.server.Controller;

import java.util.List;

import com.tennisdb.server.DTO.ErrorResponse;
import com.tennisdb.server.Model.Video;
import com.tennisdb.server.Service.VideoService;

// import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class VideoController {

	private VideoService videoService;

	public VideoController(VideoService videoService) {
		this.videoService = videoService;
	}

	@GetMapping(value = "videos")
	public ResponseEntity<List<Video>> getVideos() {
		List<Video> videos = videoService.getVideos();
		return ResponseEntity.status(200).body(videos);
	}

	@PostMapping(value = "videos/add")
	public ResponseEntity<?> addVideo(@RequestBody Video video) {
		if (!videoService.getVideoByYoutubeId(video.getYoutubeId()).isPresent()) {
			videoService.addNewVideo(video);
			// Return the complete updated list of videos
			List<Video> allVideos = videoService.getVideos();
			return ResponseEntity.status(200).body(allVideos);
		} else {
			ErrorResponse error = new ErrorResponse(400, "This id is already registered");
			return ResponseEntity.status(400).body(error);
		}
	}
}
