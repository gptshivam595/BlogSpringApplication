
# Blog App

[![](https://camo.githubusercontent.com/003d42ed80a5259e46c47df38829f811560e6953374d3b9c36275bb5c0df9f5c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f537072696e672d3644423333463f7374796c653d666f722d7468652d6261646765266c6f676f3d737072696e67266c6f676f436f6c6f723d7768697465)](https://choosealicense.co)
[![](https://camo.githubusercontent.com/c1c08eb7625abe1a813e5ad05a94891aa127a37e0ce126b59ecda28233effdac/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d7953514c2d3030303030463f7374796c653d666f722d7468652d6261646765266c6f676f3d6d7973716c266c6f676f436f6c6f723d7768697465)](https://choosealicense.co)
[![](https://camo.githubusercontent.com/94255ec6b3c759a685d09b160102f6780416030ba75119a1d9d05cd1d2345e5a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4a6176612d4544384230303f7374796c653d666f722d7468652d6261646765266c6f676f3d6a617661266c6f676f436f6c6f723d7768697465)](https://choosealicense.co)
[![](https://camo.githubusercontent.com/2a92e09492704391837d8ff8d1f6e7078e63daab8e40ba21d86f131bffa7cc90/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4170616368652532304d6176656e2d4337314133363f7374796c653d666f722d7468652d6261646765266c6f676f3d4170616368652532304d6176656e266c6f676f436f6c6f723d7768697465)](https://choosealicense.co)
[![](https://img.shields.io/badge/JDK_Version-1.7-green
)](https://choosealicense.co)
[![](https://img.shields.io/badge/Swagger-Enabled-green
)](https://choosealicense.co)

## Overview

The Blog Application is a backend-only project developed using Spring Boot. It leverages REST APIs to offer a robust platform for users to interact through posts, comments, and categories. This application is designed to handle various functionalities crucial for a blogging platform, ensuring a seamless and secure user experience.



## Features Implemented

1. Users

```bash
  - Registeration & Sign In
  - Session Token generation
  - Post text , image or file
  - Update/Edit Post
  - Delete Post
  - Comment on Post 
```
2. Admin

```bash
  - Delete any Post
  - Get All Users Data
```

## Guidelines
**Backend**

- To run the application on localhost
      
   i. Import git repo via this command
   ```bash
  git clone https://github.com/gptshivam595/BlogSpringApplication.git
   ```
   ii. Open and Build the app using IntelliJ as a Maven Project
   
   iii.Server starts on the the port 9091

   iv.For swagger api hit at ***localhost:9091/swagger-ui.html***

### Run backend without local MySQL (dev profile)

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=dev
```

This uses an in-memory H2 datasource from `application-dev.properties`.

### Deployment environment variables (backend)

For cloud deployment, set these variables so the app binds correctly and connects to your managed database:

- `PORT` (optional; defaults to `9091`)
- `SPRING_DATASOURCE_URL` (optional for local; defaults to `jdbc:mysql://localhost:3306/blog_app_apis`)
- `SPRING_DATASOURCE_USERNAME` (optional for local; defaults to `root`)
- `SPRING_DATASOURCE_PASSWORD` (optional for local; defaults to `changeme`)
- `SPRING_DATASOURCE_DRIVER_CLASS_NAME` (optional; defaults to `com.mysql.cj.jdbc.Driver`)
- `SPRING_JPA_HIBERNATE_DIALECT` (optional; defaults to `org.hibernate.dialect.MySQL8Dialect`)
- `SPRING_JPA_HIBERNATE_DDL_AUTO` (optional; defaults to `validate`)
- `APP_CORS_ALLOWED_ORIGINS` (required for deployed frontend; comma-separated origins, e.g. `https://your-frontend.vercel.app`)

For local development, you can override `SPRING_JPA_HIBERNATE_DDL_AUTO` to `update` (or use the `dev` profile) to auto-create/update schema.

## Hosting (Backend + MySQL + Vercel Frontend)

### 1) Host backend (Render/Railway/EC2)

- Build command: `./mvnw clean package -DskipTests`
- Start command: `java -jar target/*.jar`

For Render specifically, this repository includes `render.yaml` with the same build/start configuration.

### 2) Provision managed MySQL

Use any managed MySQL provider (for example PlanetScale, Aiven, AWS RDS, or Railway MySQL), then set:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Keep:

- `SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver`
- `SPRING_JPA_HIBERNATE_DIALECT=org.hibernate.dialect.MySQL8Dialect`
- `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` (or temporary `update` for first-time schema bootstrapping)

### 3) Host frontend on Vercel

`vercel.json` is already configured to build from `frontend/` and output `frontend/dist`.

Set Vercel environment variable:

- `VITE_API_BASE_URL=https://<your-backend-domain>`

Set backend CORS environment variable to allow your Vercel domain:

- `APP_CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>`

### 4) Deploy order

1. Deploy backend and verify `https://<backend-domain>/swagger-ui.html`
2. Deploy frontend with `VITE_API_BASE_URL` pointing to backend

### 5) Validate after deploy

- Register and login from frontend
- Create/read posts from frontend
- Confirm browser network calls hit backend domain, not Vercel domain

  
## Maven Libraries used

- [Spring boot Starter Web](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web/3.3.1 )  : To create a spring boot application
- [Spring boot Starter Security](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-security/3.3.1 ) : To add salt and pepper encrytption in registeration
- [Swagger](https://mvnrepository.com/artifact/io.openapitools.swagger/swagger-maven-plugin/2.1.6) : To generate api endpoints list
- [Lombok](https://mvnrepository.com/artifact/org.projectlombok/lombok/1.18.34) : To auto generate getter and setter
- [Mysql COnnector](https://mvnrepository.com/artifact/mysql/mysql-connector-java/8.0.33) : To connect spring boot application to mysql database
- [JPAConnector](https://mvnrepository.com/artifact/org.glassfish.main.persistence/jpa-connector/3.1.2.2) : TO perform prebuild mysql queries
- [JWT](https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt/0.12.6) :To secure, stateless authentication and authorization in web applications. 
## Tech Stack

**Spring Boot:**  is used for fast REST API development and independant deployment.

**MySQL:** A powerful framework that simplifies the development of Java-based enterprise applications.

**JWT(JSON Web Token):** Used for secure, stateless authentication and authorization.

**REST APIs:** Ensuring smooth communication between the frontend and backend with stateless operations.
## DB Schema

![image](https://github.com/gptshivam595/BlogSpringApplication/blob/fbd0776d07847f75f4125ca1eb06b7d9ee6026d2/DB-Schema.png)

## System Architecture Diagram

![image](https://github.com/gptshivam595/BlogSpringApplication/blob/main/System%20Architecture%20Diagram.jpg)

## Communication

For support, email gptshivam595@gmail.com .
