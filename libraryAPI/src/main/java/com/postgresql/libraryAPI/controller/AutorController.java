package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Autor;
import com.postgresql.libraryAPI.repository.AutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/autorzy")
@CrossOrigin(origins = "*")
public class AutorController {
    
    @Autowired
    private AutorRepository autorRepository;
    
    // GET wszystkich autorów
    @GetMapping
    public ResponseEntity<List<Autor>> getAllAutorzy() {
        return ResponseEntity.ok(autorRepository.findAll());
    }
    
    // GET autora po ID
    @GetMapping("/{id}")
    public ResponseEntity<Autor> getAutorById(@PathVariable Integer id) {
        return autorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // GET autorów po nazwisku (wyszukiwanie)
    @GetMapping("/search")
    public ResponseEntity<List<Autor>> searchByNazwisko(@RequestParam String nazwisko) {
        return ResponseEntity.ok(autorRepository.findByNazwiskoContainingIgnoreCase(nazwisko));
    }
    
    // GET autorów po kraju
    @GetMapping("/kraj/{kraj}")
    public ResponseEntity<List<Autor>> getByKraj(@PathVariable String kraj) {
        return ResponseEntity.ok(autorRepository.findByKraj(kraj));
    }
}
