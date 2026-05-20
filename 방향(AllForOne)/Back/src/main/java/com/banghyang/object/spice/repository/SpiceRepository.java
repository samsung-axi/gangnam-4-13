package com.banghyang.object.spice.repository;

import com.banghyang.object.spice.entity.Spice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpiceRepository extends JpaRepository<Spice, Long> {
    Spice findByNameKr(String nameKr);
}
