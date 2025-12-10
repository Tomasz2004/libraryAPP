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

    /**
     * FORMULARZ: Wyszukiwanie książek według autora, tytułu, gatunku lub roku
     * wydania
     * Parametry (wszystkie opcjonalne):
     * - tytul: fragment tytułu książki (z % dla wildcards)
     * - autor: fragment nazwiska autora (z % dla wildcards)
     * - gatunek: gatunek (z % dla wildcards)
     * - rokWydania: rok wydania
     */
    @GetMapping
    public ResponseEntity<List<Ksiazka>> getAllKsiazki(
            @RequestParam(required = false) String tytul,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) String gatunek,
            @RequestParam(required = false) Integer rokWydania) {

        // Dodaj % dla LIKE i konwertuj na lowercase jeśli parametr istnieje
        String tytulikePattern = tytul != null ? "%" + tytul.toLowerCase() + "%" : null;
        String autorLikePattern = autor != null ? "%" + autor.toLowerCase() + "%" : null;
        String gatunekLikePattern = gatunek != null ? "%" + gatunek.toLowerCase() + "%" : null;

        return ResponseEntity
                .ok(ksiazkaRepository.searchKsiazki(tytulikePattern, autorLikePattern, gatunekLikePattern, rokWydania));
    }

    // GET książki po ID
    @GetMapping("/{id}")
    public ResponseEntity<Ksiazka> getKsiazkaById(@PathVariable Integer id) {
        return ksiazkaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
