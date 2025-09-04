package com.tennisdb.server.Controller;

import java.util.List;

import com.tennisdb.server.Model.Video;
import com.tennisdb.server.Service.VideoService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

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
}
