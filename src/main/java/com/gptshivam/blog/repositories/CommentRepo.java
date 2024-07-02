package com.gptshivam.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gptshivam.blog.entities.Comment;

public interface CommentRepo extends JpaRepository<Comment, Integer> {

}
