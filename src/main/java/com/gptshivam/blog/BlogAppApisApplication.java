package com.gptshivam.blog;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

//import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@ComponentScan ({"com.gptshivam.blog.services", "com.gptshivam.blog.config" ,"com.gptshivam.blog.payloads" , "com.gptshivam.blog.controllers","com.gptshivam.blog.exception" })
@EnableJpaRepositories ("com.gptshivam.blog.repositories")
//@EnableSwagger2
public class BlogAppApisApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlogAppApisApplication.class, args);
	}
	
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

}
  