package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.dto.PracownikCreateDTO;
import com.postgresql.libraryAPI.model.Biblioteka;
import com.postgresql.libraryAPI.model.Pracownik;
import com.postgresql.libraryAPI.repository.BibliotekaRepository;
import com.postgresql.libraryAPI.repository.PracownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/pracownicy")
@CrossOrigin(origins = "*")
public class PracownikController {

    @Autowired
    private PracownikRepository pracownikRepository;

    @Autowired
    private BibliotekaRepository bibliotekaRepository;

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

    @PostMapping
    public ResponseEntity<?> createPracownik(@RequestBody PracownikCreateDTO dto) {
        Biblioteka biblioteka = bibliotekaRepository.findById(dto.getBibliotekaId()).orElse(null);
        if (biblioteka == null) {
            return ResponseEntity.badRequest().body("Biblioteka with ID " + dto.getBibliotekaId() + " not found.");
        }
        Pracownik pracownik = new Pracownik();
        pracownik.setImie(dto.getImie());
        pracownik.setNazwisko(dto.getNazwisko());
        pracownik.setStanowisko(dto.getStanowisko());
        pracownik.setBiblioteka(biblioteka);
        pracownik.setZatrudnionyOd(dto.getZatrudnionyOd());
        Pracownik savedPracownik = pracownikRepository.save(pracownik);
        return ResponseEntity.ok(savedPracownik);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePracownik(@PathVariable Integer id, @RequestBody PracownikCreateDTO dto) {
        return pracownikRepository.findById(id).map(existingPracownik -> {
            Biblioteka biblioteka = bibliotekaRepository.findById(dto.getBibliotekaId()).orElse(null);
            if (biblioteka == null) {
                return ResponseEntity.badRequest().body("Biblioteka with ID " + dto.getBibliotekaId() + " not found.");
            }
            existingPracownik.setImie(dto.getImie());
            existingPracownik.setNazwisko(dto.getNazwisko());
            existingPracownik.setStanowisko(dto.getStanowisko());
            existingPracownik.setBiblioteka(biblioteka);
            existingPracownik.setZatrudnionyOd(dto.getZatrudnionyOd());
            Pracownik updatedPracownik = pracownikRepository.save(existingPracownik);
            return ResponseEntity.ok(updatedPracownik);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePracownik(@PathVariable Integer id) {
        return pracownikRepository.findById(id).map(pracownik -> {
            pracownikRepository.delete(pracownik);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
