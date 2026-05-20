package com.banghyang.object.spice.repository;

import com.banghyang.object.spice.entity.Spice;
import com.banghyang.object.spice.entity.SpiceImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpiceImageRepository extends JpaRepository<SpiceImage, Long> {
    List<SpiceImage> findBySpice(Spice spice);
}
