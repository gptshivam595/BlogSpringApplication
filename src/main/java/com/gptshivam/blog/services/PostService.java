package com.gptshivam.blog.services;

import java.util.List;

//import com.gptshivam.blog.entities.Post;
import com.gptshivam.blog.payloads.PostDto;
import com.gptshivam.blog.payloads.PostResponse;

public interface PostService {
	
	PostDto createPost(PostDto postDto , Integer userId, Integer categoryId);
	
	PostDto updatePost(PostDto postDto , Integer postId);
	
	void deletePost(Integer postId);
	
	PostResponse getAllPost(Integer pageNumber, Integer pageSize , String sortBy,String sortDir);
	
	PostDto getPostById(Integer postId);
	
	//get all posts by category
	List<PostDto> getPostsByCategory(Integer categoryId);
	
	//get all posts by user
	List<PostDto> getPostsByUser(Integer userId);

	List<PostDto> searchPosts(String keyword);
}
