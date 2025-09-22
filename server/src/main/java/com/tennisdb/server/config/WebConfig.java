package com.tennisdb.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	public WebConfig() {
        System.out.println("WebConfig loaded successfully!");
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
