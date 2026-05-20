package com.bangkoo.back.controller.placement;


import com.bangkoo.back.repository.auth.Product3dRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Product3dController {

    private final Product3dRepository product3dRepository;

    @GetMapping("/3d-url/{id}")
    public ResponseEntity<String> get3DModelUrl(@PathVariable String id) {
        return product3dRepository.findById(id)
                .map(product -> ResponseEntity.ok(product.getModel3dUrl()))
                .orElse(ResponseEntity.notFound().build());
    }
}
