package com.example.final_project_be.domain.food.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "food_nutrition")
@EntityListeners(AuditingEntityListener.class)
public class FoodNutrition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double calories;

    private Double protein;

    private Double carbs;

    private Double fat;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;
}