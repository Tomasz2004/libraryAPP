package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Egzemplarz;
import com.postgresql.libraryAPI.repository.EgzemplarzRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/egzemplarze")
@CrossOrigin(origins = "*")
public class EgzemplarzController {
    
    @Autowired
    private EgzemplarzRepository egzemplarzRepository;
    
    // GET wszystkich egzemplarzy
    @GetMapping
    public ResponseEntity<List<Egzemplarz>> getAllEgzemplarze() {
        return ResponseEntity.ok(egzemplarzRepository.findAll());
    }
    
    // GET egzemplarza po ID
    @GetMapping("/{id}")
    public ResponseEntity<Egzemplarz> getEgzemplarzById(@PathVariable Integer id) {
        return egzemplarzRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * FORMULARZ: Filtr dostępności książek – wyświetlanie pozycji „dostępnych" lub „wypożyczonych"
     * Parametry (opcjonalne):
     * - status: dostepny/wypozyczony/zablokowany
     * - bibliotekaId: ID biblioteki
     */
    @GetMapping("/search")
    public ResponseEntity<List<Egzemplarz>> searchEgzemplarze(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer bibliotekaId) {
        
        return ResponseEntity.ok(egzemplarzRepository.searchEgzemplarze(status, bibliotekaId));
    }
    
    // GET egzemplarzy według statusu (dostepny/wypozyczony/zablokowany)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Egzemplarz>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(egzemplarzRepository.findByStatus(status));
    }
    
    // GET dostępnych egzemplarzy
    @GetMapping("/dostepne")
    public ResponseEntity<List<Egzemplarz>> getDostepne() {
        return ResponseEntity.ok(egzemplarzRepository.findByStatus("dostepny"));
    }
    
    // GET wypożyczonych egzemplarzy
    @GetMapping("/wypozyczone")
    public ResponseEntity<List<Egzemplarz>> getWypozyczone() {
        return ResponseEntity.ok(egzemplarzRepository.findByStatus("wypozyczony"));
    }
    
    // GET egzemplarzy danej książki
    @GetMapping("/ksiazka/{ksiazkaId}")
    public ResponseEntity<List<Egzemplarz>> getByKsiazka(@PathVariable Integer ksiazkaId) {
        return ResponseEntity.ok(egzemplarzRepository.findByKsiazkaKsiazkaId(ksiazkaId));
    }
    
    // GET egzemplarzy z danej biblioteki
    @GetMapping("/biblioteka/{bibliotekaId}")
    public ResponseEntity<List<Egzemplarz>> getByBiblioteka(@PathVariable Integer bibliotekaId) {
        return ResponseEntity.ok(egzemplarzRepository.findByBibliotekaBibliotekaId(bibliotekaId));
    }
}
