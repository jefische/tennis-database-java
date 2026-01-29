package com.tennisdb.server.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SummaryResponse {
    private String summary;
    // Future: private List<Timestamp> timestamps;
}
