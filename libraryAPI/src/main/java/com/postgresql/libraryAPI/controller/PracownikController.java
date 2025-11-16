package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Pracownik;
import com.postgresql.libraryAPI.repository.PracownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pracownicy")
@CrossOrigin(origins = "*")
public class PracownikController {
    
    @Autowired
    private PracownikRepository pracownikRepository;
    
    // GET wszystkich pracowników
    @GetMapping
    public ResponseEntity<List<Pracownik>> getAllPracownicy() {
        return ResponseEntity.ok(pracownikRepository.findAll());
    }
    
    // GET pracownika po ID
    @GetMapping("/{id}")
    public ResponseEntity<Pracownik> getPracownikById(@PathVariable Integer id) {
        return pracownikRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // GET pracowników z danej biblioteki
    @GetMapping("/biblioteka/{bibliotekaId}")
    public ResponseEntity<List<Pracownik>> getByBiblioteka(@PathVariable Integer bibliotekaId) {
        return ResponseEntity.ok(pracownikRepository.findByBibliotekaBibliotekaId(bibliotekaId));
    }
    
    // GET pracowników po stanowisku
    @GetMapping("/stanowisko/{stanowisko}")
    public ResponseEntity<List<Pracownik>> getByStanowisko(@PathVariable String stanowisko) {
        return ResponseEntity.ok(pracownikRepository.findByStanowisko(stanowisko));
    }
}
