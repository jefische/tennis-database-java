package com.tennisdb.server.config;

import com.tennisdb.server.security.JwtAuthFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Static resources & SPA routes
                .requestMatchers(HttpMethod.GET, "/", "/index.html", "/assets/**", "/icons/**", "/favicon.ico", "/bgs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/sitemap.xml", "/robots.txt").permitAll()
                .requestMatchers(HttpMethod.GET, "/{path:[^.]*}").permitAll()
                .requestMatchers(HttpMethod.GET, "/{path1:[^.]*}/{path2:[^.]*}").permitAll()
                .requestMatchers(HttpMethod.GET, "/{path1:[^.]*}/{path2:[^.]*}/{path3:[^.]*}").permitAll()
                // Public API endpoints
                .requestMatchers(HttpMethod.GET, "/videos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/videosAI").permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/contact").permitAll()
                // Protected endpoints — require authentication
                .requestMatchers(HttpMethod.POST, "/videos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/videos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/videos/**").hasRole("ADMIN")
                .requestMatchers("/api/summary/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/backfill").hasRole("ADMIN")
                // Everything else requires auth
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"Unauthorized\"}");
                })
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            // .oauth2ResourceServer(null);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
