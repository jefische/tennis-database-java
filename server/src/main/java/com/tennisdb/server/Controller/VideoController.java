package com.tennisdb.server.controller;

import java.util.List;

import com.tennisdb.server.model.Video;
import com.tennisdb.server.service.VideoService;
import com.tennisdb.server.dto.ErrorResponse;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestParam;

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

	@GetMapping(value = "videos/{youtubeId}")
	public ResponseEntity<?> getVideoById(@PathVariable String youtubeId) {
		Video video = videoService.getVideoByYoutubeId(youtubeId).orElse(null);
		if (video != null) {
			return ResponseEntity.status(200).body(video);
		} else {
			ErrorResponse error = new ErrorResponse(404, "Video not found");
			return ResponseEntity.status(404).body(error);
		}
	}

	@DeleteMapping(value = "videos/{youtubeId}")
	public ResponseEntity<?> deleteVideoById(@PathVariable String youtubeId) {
		if (videoService.deleteVideoByYoutubeId(youtubeId)) {
			List<Video> videos = videoService.getVideos();
			return ResponseEntity.status(200).body(videos);
		}
		else {
			ErrorResponse error = new ErrorResponse(404, "Video not found");
			return ResponseEntity.status(404).body(error);
		}
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

	@PutMapping(value = "videos/edit")
	public ResponseEntity<List<Video>> updateVideo(@RequestBody Video video) {
		if (videoService.updateVideoByYoutubeId(video)) {
			List<Video> allVideos = videoService.getVideos();
			return ResponseEntity.status(200).body(allVideos);
		} else {
			return ResponseEntity.status(400).build();
		}
	}

}
