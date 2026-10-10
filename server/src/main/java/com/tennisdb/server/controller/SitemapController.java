package com.tennisdb.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.HtmlUtils;

import com.tennisdb.server.service.VideoService;
import com.tennisdb.server.model.Video;

@Controller 
public class SitemapController {
    private final VideoService videoService;
    

    public SitemapController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @ResponseBody 
    public ResponseEntity<String> getSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
        xml.append("<url><loc>https://thetennisarchive.com/home</loc></url>");
        
        // TODO: hardcoded until player_videos table + dynamic player list exist
        xml.append("<url><loc>https://thetennisarchive.com/players/nadal</loc></url>");
        xml.append("<url><loc>https://thetennisarchive.com/players/federer</loc></url>");
        xml.append("<url><loc>https://thetennisarchive.com/players/wawrinka</loc></url>");
        xml.append("<url><loc>https://thetennisarchive.com/players/swillimas</loc></url>");

        for (Video v: videoService.getVideos()) {
            xml.append("<url><loc>https://thetennisarchive.com/matches/");
            xml.append(HtmlUtils.htmlEscape(v.getYoutubeId()));
            xml.append("</loc></url>");
        }

        xml.append("</urlset>");
        
        return ResponseEntity.status(200).body(xml.toString());
    }
}
