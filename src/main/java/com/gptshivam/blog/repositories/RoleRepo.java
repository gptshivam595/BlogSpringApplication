package com.gptshivam.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gptshivam.blog.entities.Role;

public interface RoleRepo extends JpaRepository<Role, Integer>{

}
