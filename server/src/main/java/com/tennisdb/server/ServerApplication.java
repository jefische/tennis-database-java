package com.tennisdb.server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Value("${spring.application.name}")
	private String appName;

	@Bean
	public CommandLineRunner inspectorBean(ApplicationContext aC) {
		return args -> {
			System.out.printf("Inspecting the beans provided by Spring Boot in %s...", appName).println();

			String[] beans = aC.getBeanDefinitionNames();
			Arrays.sort(beans);
			for (String bean : beans) {
				System.out.println(bean);
			}
			System.out.println("Ending our inspection...");
		};
	}

}
