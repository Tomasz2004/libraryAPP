package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Biblioteka;
import com.postgresql.libraryAPI.repository.BibliotekaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/biblioteki")
@CrossOrigin(origins = "*")
public class BibliotekaController {
    
    @Autowired
    private BibliotekaRepository bibliotekaRepository;
    
    // GET wszystkich bibliotek
    @GetMapping
    public ResponseEntity<List<Biblioteka>> getAllBiblioteki() {
        return ResponseEntity.ok(bibliotekaRepository.findAll());
    }
    
    // GET biblioteki po ID
    @GetMapping("/{id}")
    public ResponseEntity<Biblioteka> getBibliotekaById(@PathVariable Integer id) {
        return bibliotekaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
