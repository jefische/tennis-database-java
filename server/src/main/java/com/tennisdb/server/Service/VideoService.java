package com.tennisdb.server.Service;

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
		return videoRepository.findAll();
	}
}
