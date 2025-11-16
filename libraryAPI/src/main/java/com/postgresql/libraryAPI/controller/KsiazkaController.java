package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Ksiazka;
import com.postgresql.libraryAPI.repository.KsiazkaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ksiazki")
@CrossOrigin(origins = "*")
public class KsiazkaController {
    
    @Autowired
    private KsiazkaRepository ksiazkaRepository;
    
    // GET wszystkich książek
    @GetMapping
    public ResponseEntity<List<Ksiazka>> getAllKsiazki() {
        return ResponseEntity.ok(ksiazkaRepository.findAll());
    }
    
    // GET książki po ID
    @GetMapping("/{id}")
    public ResponseEntity<Ksiazka> getKsiazkaById(@PathVariable Integer id) {
        return ksiazkaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * FORMULARZ: Wyszukiwanie książek według autora, tytułu, gatunku lub roku wydania
     * Parametry (wszystkie opcjonalne):
     * - tytul: fragment tytułu książki
     * - autor: fragment nazwiska autora
     * - gatunek: dokładny gatunek
     * - rokWydania: rok wydania
     */
    @GetMapping("/search")
    public ResponseEntity<List<Ksiazka>> searchKsiazki(
            @RequestParam(required = false) String tytul,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) String gatunek,
            @RequestParam(required = false) Integer rokWydania) {
        
        return ResponseEntity.ok(ksiazkaRepository.searchKsiazki(tytul, autor, gatunek, rokWydania));
    }
    
    // GET książek po tytule
    @GetMapping("/tytul/{tytul}")
    public ResponseEntity<List<Ksiazka>> getByTytul(@PathVariable String tytul) {
        return ResponseEntity.ok(ksiazkaRepository.findByTytulContainingIgnoreCase(tytul));
    }
    
    // GET książek po autorze
    @GetMapping("/autor/{autor}")
    public ResponseEntity<List<Ksiazka>> getByAutor(@PathVariable String autor) {
        return ResponseEntity.ok(ksiazkaRepository.findByAutorNazwiskoContainingIgnoreCase(autor));
    }
    
    // GET książek po gatunku
    @GetMapping("/gatunek/{gatunek}")
    public ResponseEntity<List<Ksiazka>> getByGatunek(@PathVariable String gatunek) {
        return ResponseEntity.ok(ksiazkaRepository.findByGatunekIgnoreCase(gatunek));
    }
    
    // GET książek po roku wydania
    @GetMapping("/rok/{rok}")
    public ResponseEntity<List<Ksiazka>> getByRok(@PathVariable Integer rok) {
        return ResponseEntity.ok(ksiazkaRepository.findByRokWydania(rok));
    }
}
