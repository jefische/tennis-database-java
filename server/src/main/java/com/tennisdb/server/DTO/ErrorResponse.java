package com.tennisdb.server.DTO;

public class ErrorResponse {
    private int status;
    private String error;
    
    public ErrorResponse(int status, String error) {
        this.status = status;
        this.error = error;
    }
    
    // Getters and setters
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
