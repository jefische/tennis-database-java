package com.tennisdb.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Tells Spring class contains bean definitions and configs for application context.
public class WebConfig implements WebMvcConfigurer {

	public WebConfig() {
        System.out.println("WebConfig loaded successfully!");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve React static assets
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");
    }
    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // Forward all non-API routes to React app
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/{path:[^.]*}").setViewName("forward:/index.html");
    }
}
