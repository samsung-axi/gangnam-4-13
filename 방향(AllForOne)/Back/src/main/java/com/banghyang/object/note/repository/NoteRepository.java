package com.banghyang.object.note.repository;

import com.banghyang.object.note.entity.Note;
import com.banghyang.object.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByProduct(Product product);
}
