package com.tennisdb.server.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VideoResponse {
    private Integer videoId;
    private String tournament;
    private Integer year;
    private String youtubeId;
    private String player1;
    private String player2;
    private String title;
    private String round;
    private String duration;
    private SummaryResponse summary;
}
