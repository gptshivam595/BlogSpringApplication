package com.gptshivam.blog.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gptshivam.blog.entities.User;
import com.gptshivam.blog.exception.ResourceNotFoundException;
import com.gptshivam.blog.repositories.UserRepo;
@Service
public class CustomUserDetailServie implements UserDetailsService{

	@Autowired
	private UserRepo userRepo;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		//loading user from database by userName
		User user = this.userRepo.findByEmail(username)
				.orElseThrow(()-> new ResourceNotFoundException("User", "email : "+username, 0));
		return user;
	}
	
		
}
