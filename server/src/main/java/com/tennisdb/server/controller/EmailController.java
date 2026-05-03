package com.tennisdb.server.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.tennisdb.server.dto.EmailRequest;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import java.util.Map;

@RestController
public class EmailController {

    @Value("${RESEND_API_KEY}")
    private String apiKey;

    @PostMapping(value="contact")
    public ResponseEntity<?> sendMessage(@RequestBody EmailRequest requestBody) {
        Resend resend = new Resend(apiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                // .from("Match Archive <noreply@yourverifieddomain.com>")
                .from("Match Archive <onboarding@resend.dev>")
                .to("jeremy.ev.fischer@gmail.com")
                .subject("FAQ message from the Match Archive")
                .html("<p>" + requestBody.getMessage() + "</p><br>" + 
                        requestBody.getName() + "<br>" + requestBody.getEmail())
                .build();

         try {
            CreateEmailResponse data = resend.emails().send(params);
            return ResponseEntity.ok(Map.of("success", true, "id", data.getId()));
        } catch (ResendException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
