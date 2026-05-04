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

    @Value("${SUMMARY_SERVICE_URL:http://localhost:3001}")
    private String summaryServiceUrl;

    public SummaryService(VideoRepository videoRepository, RestTemplate restTemplate) {
        this.videoRepository = videoRepository;
        this.restTemplate = restTemplate;
    }

    public Map<String, String> generateSummary(String youtubeUrl, Video video) {
        String endpoint = summaryServiceUrl + "/agent/summary";
        Map<String, String> result = new HashMap<>();

        // Debug: print video details
        System.out.println("Video object: " + video);
        System.out.println("Player1: " + video.getPlayer1());
        System.out.println("Player2: " + video.getPlayer2());

        // Create request body with video details
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("youtubeUrl", youtubeUrl);
        requestBody.put("player1", video.getPlayer1());
        requestBody.put("player2", video.getPlayer2());
        requestBody.put("tournament", video.getTournament());
        requestBody.put("year", video.getYear());
        requestBody.put("round", video.getRound());
        requestBody.put("title", video.getTitle());

        System.out.println("Request body: " + requestBody);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create HTTP entity
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

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
                String r1 = (String) responseBody.get("summary");
                result.put("summary", r1);
                result.put("status", "yes");
                return result;

            }

            throw new RuntimeException("No summary returned from service");

        } catch (org.springframework.web.client.HttpClientErrorException e) {

            if (e.getStatusCode().value() == 429) {
                throw e;
            }
            String responseBody = e.getResponseBodyAsString();
            System.out.println("Python service client error response: " + responseBody);
            String errorMsg = responseBody;
            try {
                var json = new com.fasterxml.jackson.databind.ObjectMapper().readTree(responseBody);
                if (json.has("error")) {
                    errorMsg = json.get("error").asText();
                }
            } catch (Exception ignored) {}

            String r1 = "{\"winner\":\"\",\"score\":\"\",\"matchRating\":0,\"overview\":\"" + errorMsg + "\",\"highlights\":[\"\"],\"tags\":[\"\"]}";
            result.put("summary", r1);
            result.put("status", "no_transcript");
            return result;
        }
    }

    public void saveSummaryToVideo(String youtubeId, String summary, String summaryStatus) {
        Video video = videoRepository.findByYoutubeId(youtubeId)
            .orElseThrow(() -> new RuntimeException("Video not found with youtubeId: " + youtubeId));

        video.setSummary(summary);
        video.setSummaryStatus(summaryStatus);
        videoRepository.save(video);
    }
}
