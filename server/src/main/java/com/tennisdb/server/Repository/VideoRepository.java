package com.tennisdb.server.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.tennisdb.server.model.Video;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface VideoRepository extends JpaRepository<Video, Integer> {
	
	Optional<Video> findByYoutubeId(String id);
}
