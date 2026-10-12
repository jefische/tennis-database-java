package com.tennisdb.server.util;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DurationUtil {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Pattern ISO_DURATION =
		Pattern.compile("P(?:(\\d+)D)?T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?");

    public DurationUtil() {}

    public String extractISO(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            String iso = rootNode.path("items").path(0).path("contentDetails").path("duration").asText();
            return iso;
        } catch (Exception ignore) {
            return null;
        }
    }

    public int isoToSeconds(String iso) {
        if (iso == null) return 0;

        Matcher m = ISO_DURATION.matcher(iso);
        if (!m.matches()) return 0;

        // Integer.parseInt(m.group(N)) will throw NumberFormatException whenever a 
        // group didn't match. ISO 8601 durations are only required to include the 
        // components that are nonzero — e.g. "PT44M13S" (no days, no hours) is completely
        // normal and extremely common for match videos. In that case m.group(1) (days) 
        // and m.group(2) (hours) are both null, and Integer.parseInt(null) throws
        int days = parseGroup(m.group(1));
        int hours = parseGroup(m.group(2));
        int minutes = parseGroup(m.group(3));
        int seconds = parseGroup(m.group(4));

        return days * 86400 + hours * 3600 + minutes * 60 + seconds;
    }

    private int parseGroup(String group) {
        return group == null ? 0 : Integer.parseInt(group);
    }

}
