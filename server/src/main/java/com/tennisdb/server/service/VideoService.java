package com.tennisdb.server.service;

// import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tennisdb.server.model.Video;
import com.tennisdb.server.repository.VideoRepository;

@Service
public class VideoService {
	
	private VideoRepository videoRepository;

	public VideoService(VideoRepository videoRepository) {
		this.videoRepository = videoRepository;
	}

	public List<Video> getVideos() {
		// Video video1 = new Video(1, "http://example.com/video1");
		// Video video2 = new Video(2, "http://example.com/video2");
		// Video video3 = new Video(2, "http://example.com/video2");
		// List<Video> result = Arrays.asList(video1, video2, video3);
		// return result;
		return videoRepository.findAll();
	}

	public Video addNewVideo(Video video) {
		return videoRepository.save(video);
	}

	public Optional<Video> getVideoByYoutubeId(String id) {
		return videoRepository.findByYoutubeId(id);
	}

	public boolean updateVideoByYoutubeId(Video video) {
		Video toEdit = videoRepository.findByYoutubeId(video.getYoutubeId()).orElse(null);
		if (toEdit == null) return false;
		else {
			toEdit.setPlayer1(video.getPlayer1());
			toEdit.setPlayer2(video.getPlayer2());	
			toEdit.setRound(video.getRound());
			toEdit.setTitle(video.getTitle());
			toEdit.setTournament(video.getTournament());
			toEdit.setYear(video.getYear());
			videoRepository.save(toEdit);
			return true;
		}
	}

	public boolean deleteVideoByYoutubeId(String id) {
		Video toDelete = videoRepository.findByYoutubeId(id).orElse(null);
		if (toDelete != null) {
			videoRepository.delete(toDelete);
			return true;
		}
		return false;
	}
}
