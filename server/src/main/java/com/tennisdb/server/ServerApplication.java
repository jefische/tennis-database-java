package com.tennisdb.server;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Includes @ComponentScan which tells Spring to scan this package and all subpackages for components
public class ServerApplication {

	public static void main(String[] args) {
		// Load .env file for MySQL credentials
        Dotenv dotenv = Dotenv.configure()
            .directory("./")
            .ignoreIfMissing()
            .load();
        
        // Set system properties for Spring to use
        dotenv.entries().forEach(entry -> 
            System.setProperty(entry.getKey(), entry.getValue())
        );
		SpringApplication.run(ServerApplication.class, args);
	}

}
