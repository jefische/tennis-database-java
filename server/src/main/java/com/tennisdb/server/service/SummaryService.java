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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.Map;

// Methods:
// 1. `generateSummary(String youtubeUrl)` - Calls Python service via RestTemplate
// 2. `saveSummaryToVideo(String youtubeId, String summary)` - Updates Video entity with summary

@Service
public class SummaryService {

    private final VideoRepository videoRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

                // Extract the tags from the summary string
                // readTree() throws JsonProcessingException (checked), so it needs a try/catch block.
                try {
                    JsonNode tags = objectMapper.readTree(r1).get("tags");
                    result.put("tags", tags != null && tags.isArray() ? tags.toString() : "[]");
                } catch (Exception ignored) {
                    result.put("tags", "[]");
                }

                return result;

            }

            throw new RuntimeException("No summary returned from service");

        } catch (org.springframework.web.client.HttpClientErrorException e) {

            // Rate limits are rethrown so the controller can report 429 specifically.
            if (e.getStatusCode().value() == 429) {
                throw e;
            }
            String responseBody = e.getResponseBodyAsString();
            String errorMsg = responseBody;
            try {
                var json = objectMapper.readTree(responseBody);
                if (json.has("error")) {
                    errorMsg = json.get("error").asText();
                }
            } catch (Exception ignored) {}
            System.out.println("Python service client error (" + e.getStatusCode() + "): " + errorMsg);

            // A 4xx means the video genuinely has no transcript, which is a durable fact:
            // record it so the video is not retried forever. Transient upstream failures
            // arrive as 503 instead and are thrown by the HttpServerErrorException branch.
            String overview = "No transcript is available for this video.";
            String r1;
            try {
                var node = objectMapper.createObjectNode();
                node.put("winner", "");
                node.put("score", "");
                node.put("matchRating", 0.0);
                node.put("overview", overview);
                node.putArray("highlights");
                node.putArray("tags");
                r1 = objectMapper.writeValueAsString(node);
            } catch (Exception ex) {
                r1 = "{\"winner\":\"\",\"score\":\"\",\"matchRating\":0.0,\"overview\":\"" + overview + "\",\"highlights\":[],\"tags\":[]}";
            }

            result.put("summary", r1);
            result.put("status", "no_transcript");
            result.put("tags", "[]");
            return result;
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            // Any 5xx from the Python service: Gemini failure, killed worker, unhandled bug.
            // The body is not reliably JSON here (a killed gunicorn worker returns
            // Werkzeug's HTML error page), so log it rather than parse it.
            System.out.println("Python service error " + e.getStatusCode() + ": " + e.getResponseBodyAsString());
            throw new RuntimeException("Summary service failed to generate a summary. Please try again.", e);

        } catch (org.springframework.web.client.ResourceAccessException e) {
            // No HTTP response at all: read timed out, or the connection was dropped
            // (what a gunicorn worker kill looks like once its --timeout is hit).
            System.out.println("Python service unreachable or timed out: " + e.getMessage());
            throw new RuntimeException("Summary service timed out. Please try again.", e);
        }

    }

    public void saveSummaryToVideo(String youtubeId, String summary, String summaryStatus, String tags) {
        Video video = videoRepository.findByYoutubeId(youtubeId)
            .orElseThrow(() -> new RuntimeException("Video not found with youtubeId: " + youtubeId));

        video.setSummary(summary);
        video.setSummaryStatus(summaryStatus);
        video.setTags(tags);
        videoRepository.save(video);
    }

}
