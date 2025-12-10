package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.dto.BibliotekaCreateDTO;
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

    @PostMapping
    public ResponseEntity<Biblioteka> createBiblioteka(@RequestBody BibliotekaCreateDTO dto) {
        Biblioteka newBiblioteka = new Biblioteka();
        newBiblioteka.setNazwa(dto.getNazwa());
        newBiblioteka.setAdres(dto.getAdres());
        Biblioteka savedBiblioteka = bibliotekaRepository.save(newBiblioteka);
        return ResponseEntity.ok(savedBiblioteka);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Biblioteka> updateBiblioteka(@PathVariable Integer id,
            @RequestBody Biblioteka bibliotekaDetails) {
        return bibliotekaRepository.findById(id).map(existingBiblioteka -> {
            existingBiblioteka.setNazwa(bibliotekaDetails.getNazwa());
            existingBiblioteka.setAdres(bibliotekaDetails.getAdres());
            Biblioteka updatedBiblioteka = bibliotekaRepository.save(existingBiblioteka);
            return ResponseEntity.ok(updatedBiblioteka);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBiblioteka(@PathVariable Integer id) {
        return bibliotekaRepository.findById(id).map(biblioteka -> {
            bibliotekaRepository.delete(biblioteka);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
