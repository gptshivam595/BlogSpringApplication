package com.gptshivam.blog.config;

import java.lang.annotation.Annotation;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties.Admin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
		info = @Info(
				title = "BLOG API",
				description = "Blogging application",
				summary = "user can register ,login ,post , comment etc.",
				termsOfService = "T&C",
				contact = @Contact(
						name = "SHIVAM KUMAR GUPTA",
						email = "gptshivam595@gmail.com"
						),version = "v1"
						),servers = {
								@Server(
										description = "blog-app",
										url = "http://localhost:9091"
										),@Server(
												description = "test",
												url = "http://localhost:9091"
												)
						}
				)

public class SwaggerConfig {
	  
	  }

