package com.tennisdb.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class EmailRequest {
    private String name;
    private String email;
    private String message;
}
