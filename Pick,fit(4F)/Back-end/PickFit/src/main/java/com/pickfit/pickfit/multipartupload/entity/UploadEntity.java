package com.pickfit.pickfit.multipartupload.entity;

import com.pickfit.pickfit.oauth2.model.entity.UserEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="user_images")
public class UploadEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email", referencedColumnName = "email", nullable = false) // FK로 설정
    private UserEntity user;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadDate;

    public UploadEntity() {

    }

    public UploadEntity(UserEntity user, String fileName, String url, LocalDateTime uploadDate) {
        this.user = user;
        this.fileName = fileName;
        this.url = url;
        this.uploadDate = uploadDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    @Override
    public String toString() {
        return "UploadEntity{" +
                "id=" + id +
                ", userEmail=" + (user != null ? user.getEmail() : "null") +
                ", fileName='" + fileName + '\'' +
                ", url='" + url + '\'' +
                ", uploadDate=" + uploadDate +
                '}';
    }
}
