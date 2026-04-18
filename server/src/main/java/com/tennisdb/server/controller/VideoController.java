package com.tennisdb.server.controller;

import java.util.List;
import java.util.ArrayList;

import com.tennisdb.server.service.VideoService;
import com.tennisdb.server.service.SummaryService;
import com.tennisdb.server.dto.ErrorResponse;
// import com.tennisdb.server.dto.SummaryResponse;
import com.tennisdb.server.dto.VideoResponse;
import com.tennisdb.server.model.Video;

import org.springframework.http.ResponseEntity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
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
	private SummaryService summaryService;

	@Value("${GOOGLE_API_KEY}")
	private String googleApiKey;

	public VideoController(VideoService videoService, SummaryService summaryService) {
		this.videoService = videoService;
		this.summaryService = summaryService;
	}

	@GetMapping(value = "videos")
	public ResponseEntity<List<Video>> getVideos() {
		List<Video> videos = videoService.getVideos();
		return ResponseEntity.status(200).body(videos);	
	}

	@GetMapping(value = "videosAI")
	public ResponseEntity<List<VideoResponse>> getVideosAI() {
		List<Video> videos = videoService.getVideos();
		List<VideoResponse> videoReponses = new ArrayList<>();
		for (Video v: videos) {
			videoReponses.add(videoService.mapToVideoResponse(v));
		}
		return ResponseEntity.status(200).body(videoReponses);
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

	@GetMapping(value="videos/duration/{youtubeId}")
	public ResponseEntity<?> getDurationById(@PathVariable String youtubeId) {
		RestClient restClient = RestClient.create();
		try {
			String response = restClient.get()
				.uri("https://www.googleapis.com/youtube/v3/videos?id={id}&key={key}&part=snippet,contentDetails,statistics,status", youtubeId, googleApiKey)
				.retrieve()
				.body(String.class);
	
			return ResponseEntity.status(200).body(response);
		} catch (Exception e) {
			return ResponseEntity.status(400).body(e.getMessage());
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
			return ResponseEntity.status(409).build();
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

	@PostMapping(value = "api/summary/{youtubeId}")
	public ResponseEntity<?> addSummary(@PathVariable String youtubeId) {
		try {
			// Check if video exists
			Video video = videoService.getVideoByYoutubeId(youtubeId).orElse(null);
			if(video == null) {
				return ResponseEntity.status(404)
					.body(new ErrorResponse(404, "Video not found"));
			}

			// Construct full YouTube URL from youtubeId
			String youtubeUrl = "https://www.youtube.com/watch?v=" + youtubeId;

			// Generate summary from Python service
			String summary = summaryService.generateSummary(youtubeUrl, video);

			// Save summary to video entity
			summaryService.saveSummaryToVideo(youtubeId, summary);

			return ResponseEntity.ok(summary);
		} catch(Exception e) {
			return ResponseEntity.status(500)
				.body(new ErrorResponse(500, "Failed to generate summary: " + e.getMessage()));
		}
	}
}
