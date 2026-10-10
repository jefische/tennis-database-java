package com.tennisdb.server.controller;

import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Controller;

import com.tennisdb.server.service.VideoService;
import com.tennisdb.server.model.Video;
import com.tennisdb.server.dto.VideoResponse;



import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.HtmlUtils;

import java.io.IOException;


@Controller 
public class MatchPageController {
    private final VideoService videoService;
    private final String shell;

    public MatchPageController(VideoService videoService) throws IOException {
        this.videoService = videoService;
        var res = new ClassPathResource("static/index.html");
        this.shell = res.exists() ? res.getContentAsString(StandardCharsets.UTF_8) : null;
    }

    @GetMapping(value = "/matches/{youtubeId}", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity<String> match(@PathVariable String youtubeId) {
        if (shell == null) return ResponseEntity.notFound().build();

        return videoService.getVideoByYoutubeId(youtubeId)
            .map(v -> ResponseEntity.ok(render(v)))
            .orElseGet(() -> ResponseEntity.status(404).body(shell));
    }

    
    public String render(Video v) {
        // HtmlUtils.htmlEscape in case AI-generated overview or title contains ", <, &, ' characters
        String title = HtmlUtils.htmlEscape(v.getTitle());
        
        VideoResponse videoResponse = videoService.mapToVideoResponse(v);
        String description;

        if (videoResponse.getSummary() != null && !videoResponse.getSummary().getWinner().isBlank()) {
            description = HtmlUtils.htmlEscape(videoResponse.getSummary().getOverview());
        } else {
            String overview = "Watch the full match: " + videoResponse.getPlayer1() +
            " vs " + videoResponse.getPlayer2() + " at the " + videoResponse.getYear() +
            " " + videoResponse.getTournament() + ", " + videoResponse.getRound();
            description = HtmlUtils.htmlEscape(overview);
        }

        String tags = "<meta name=\"description\" content=\"" + description + "\">"
            + "<meta property=\"og:title\" content=\"" + title + "\">"
            + "<meta property=\"og:description\" content=\"" + description + "\">";

        return shell.replace("<!--SEO_TAGS-->", tags).replaceAll("<title>.*?</title>", "<title>" + title + "</title>");
    }

}
