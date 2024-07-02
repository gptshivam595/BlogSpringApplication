package com.gptshivam.blog.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gptshivam.blog.entities.Category;
import com.gptshivam.blog.entities.Post;
import com.gptshivam.blog.entities.User;

public interface PostRepo extends JpaRepository<Post,Integer> {
	List<Post> findByUser(User user);
	List<Post> findByCategory(Category category);
	List<Post> findByTitleContaining(String title);

}
