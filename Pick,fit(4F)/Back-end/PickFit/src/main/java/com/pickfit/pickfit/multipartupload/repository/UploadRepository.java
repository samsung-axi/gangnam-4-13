package com.pickfit.pickfit.multipartupload.repository;

import com.pickfit.pickfit.multipartupload.entity.UploadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadRepository extends JpaRepository<UploadEntity, Long> {
}
