package com.tennisdb.server.service;

import com.tennisdb.server.model.Video;
import com.tennisdb.server.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

// Methods:
// 1. `generateSummary(String youtubeUrl)` - Calls Python service via RestTemplate
// 2. `saveSummaryToVideo(String youtubeId, String summary)` - Updates Video entity with summary

@Service
public class SummaryService {

    private final VideoRepository videoRepository;
    private final RestTemplate restTemplate;

    @Value("${summary.service.url:http://localhost:3001}")
    private String summaryServiceUrl;

    public SummaryService(VideoRepository videoRepository, RestTemplate restTemplate) {
        this.videoRepository = videoRepository;
        this.restTemplate = restTemplate;
    }

    public String generateSummary(String youtubeUrl) {
        String endpoint = summaryServiceUrl + "/api/summary";

        // Create request body
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("youtubeUrl", youtubeUrl);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create HTTP entity
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            // Make POST request to Python service
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response =
                (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.postForEntity(
                    endpoint,
                    request,
                    Map.class
                );

            // Extract summary from response
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("summary")) {
                return (String) responseBody.get("summary");
            }

            throw new RuntimeException("No summary returned from service");

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate summary: " + e.getMessage(), e);
        }
    }

    public void saveSummaryToVideo(String youtubeId, String summary) {
        Video video = videoRepository.findByYoutubeId(youtubeId)
            .orElseThrow(() -> new RuntimeException("Video not found with youtubeId: " + youtubeId));

        video.setSummary(summary);
        videoRepository.save(video);
    }
}
