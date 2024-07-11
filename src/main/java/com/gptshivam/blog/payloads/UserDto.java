package com.gptshivam.blog.payloads;

import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
//import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class UserDto {

	
	private int id;	
	
	@NotEmpty
	@Size(min = 3 , message = "minimum character should be 3 !!")
	private String name;	
	@Email(message = "enter valid email !!")
	private String email;
	@NotEmpty
	//@Pattern(regexp ="^(?=.*[0-9])$" , message = "must have atleast a number!! ")
	private String password;	
	@NotEmpty
	private String about;
	
	private Set<RoleDto> roles= new HashSet<>();
}
