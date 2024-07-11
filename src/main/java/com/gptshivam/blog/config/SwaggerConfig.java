package com.gptshivam.blog.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;


@OpenAPIDefinition(
	    info = @Info(
	        title = "BLOG API",
	        description = "Blogging application",
	        summary = "User can register, login, post, comment, etc.",
	        termsOfService = "T&C",
	        contact = @Contact(
	            name = "SHIVAM KUMAR GUPTA",
	            email = "gptshivam595@gmail.com"
	        ),
	        version = "1.0",
	        license = @License(name = "License", url = "http://google.com")
	    ),
	    servers = {
	        @Server(
	            description = "blog-app",
	            url = "http://localhost:9091"
	        ),
	        @Server(
	            description = "test",
	            url = "http://localhost:9091"
	        )
	    },
	    security = @SecurityRequirement(name = "JWT")
	)
	@SecurityScheme(
	    name = "JWT",
	    type = SecuritySchemeType.HTTP,
	    scheme = "Bearer",
	    bearerFormat = "JWT"
	)
@Configuration
public class SwaggerConfig {

	 @Bean
	    public GroupedOpenApi api() {
	        return GroupedOpenApi.builder()
	            .group("api")
	            .pathsToMatch("/**")
	            .build();
	    }
}

