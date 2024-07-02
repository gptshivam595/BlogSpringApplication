package com.gptshivam.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gptshivam.blog.entities.User;

public interface UserRepo extends JpaRepository<User , Integer> {

}
