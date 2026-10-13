package com.tennisdb.server.service;

// import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tennisdb.server.dto.SummaryResponse;
import com.tennisdb.server.dto.VideoResponse;
import com.tennisdb.server.model.Video;
import com.tennisdb.server.repository.VideoRepository;
import com.tennisdb.server.util.DurationUtil;

@Service
public class VideoService {
	
	private VideoRepository videoRepository;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final DurationUtil durationUtil;

	@Value("${GOOGLE_API_KEY}")
	private String googleApiKey;

	public VideoService(VideoRepository videoRepository, DurationUtil durationUtil) {
		this.videoRepository = videoRepository;
		this.durationUtil = durationUtil;
	}

	public VideoResponse mapToVideoResponse(Video video) {
		VideoResponse response = new VideoResponse();
		response.setVideoId(video.getVideoId());
		response.setTournament(video.getTournament());
		response.setYear(video.getYear());
		response.setYoutubeId(video.getYoutubeId());
		response.setPlayer1(video.getPlayer1());
		response.setPlayer2(video.getPlayer2());
		response.setTitle(video.getTitle());
		response.setRound(video.getRound());
		response.setDuration(video.getDuration());

		if (video.getSummary() != null) {
			try {
				SummaryResponse summary = objectMapper.readValue(
					video.getSummary(), SummaryResponse.class
				);
				response.setSummary(summary);
			} catch (Exception e) {
				// If parsing fails, leave summary as null
			}
		}

		return response;
	}

	public List<Video> getVideos() {
		return videoRepository.findAll();
	}

	public Optional<Video> getVideoByYoutubeId(String id) {
		return videoRepository.findByYoutubeId(id);
	}
	
	public Video addNewVideo(Video video) {
		return videoRepository.save(video);
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
			toEdit.setDuration(video.getDuration());
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

	public String buildSlug(Video v) {
		String raw = v.getPlayer1() + "-vs-" + v.getPlayer2() + "-" + v.getTournament() + "-" + v.getYear() + "-";
		return raw.toLowerCase()
			.replaceAll("[^a-z0-9]+", "-")
			.replaceAll("(^-|-$)", "");
	}

	public void backfillTags() {
		List<Video> allVideos = videoRepository.findAll();
		for (Video video: allVideos) {
			if (video.getSummaryStatus() == null) continue;
			if (video.getSummaryStatus().equals("yes") && video.getTags() == null) {
				try {
					SummaryResponse summary = objectMapper.readValue(
						video.getSummary(), SummaryResponse.class
					);
					String jsonArrayString = objectMapper.writeValueAsString(summary.getTags());
					video.setTags(jsonArrayString);
					videoRepository.save(video);
				} catch (Exception e) {
					// If parsing fails, leave tags as null
				}
			}
		}
	}

	public int backfillDurationSeconds() {
		List<Video> allVideos = videoRepository.findAll();
		RestClient restClient = RestClient.create();
		int updated = 0;

		for (Video video: allVideos) {
			if (video.getDuration() == null) {
				try {
					String response = restClient.get()
						.uri("https://www.googleapis.com/youtube/v3/videos?id={id}&key={key}&part=snippet,contentDetails,statistics,status", video.getYoutubeId(), googleApiKey)
						.retrieve()
						.body(String.class);

						String iso = durationUtil.extractISO(response);
						if (iso == null) {
							System.err.println("No duration found in YouTube response for youtubeId=" + video.getYoutubeId());
						} else {
							video.setDuration(durationUtil.isoToSeconds(iso));
							videoRepository.save(video);
							updated++;
						}
				} catch (RestClientException e) {
					System.err.println("YouTube API call failed for youtubeId=" + video.getYoutubeId() + ": " + e.getMessage());
				}

				try {
					Thread.sleep(500);
				} catch (InterruptedException e) {
					Thread.currentThread().interrupt();
					break;
				}
			}
		}	
		return updated;
	}
}
