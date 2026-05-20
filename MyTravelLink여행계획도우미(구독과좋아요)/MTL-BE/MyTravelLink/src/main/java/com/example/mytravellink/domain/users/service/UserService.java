package com.example.mytravellink.domain.users.service;

import com.example.mytravellink.domain.users.entity.Users;
import com.example.mytravellink.domain.users.entity.UsersSearchTerm;
import java.util.List;
import java.util.Optional;

public interface UserService {
    void saveSearchTerm(String email, String searchTerm);
    List<UsersSearchTerm> getRecentSearches(String email);
    List<UsersSearchTerm> getSearchTerms(String email);
    void updateOrSaveSearchTerm(String email, String searchTerm);

}
