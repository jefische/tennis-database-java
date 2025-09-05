package com.tennisdb.server.Repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.tennisdb.server.Model.Video;

@Repository
public interface VideoRepository extends JpaRepository<Video, Integer> {
	
	Optional<Video> findByYoutubeId(String id);
}
