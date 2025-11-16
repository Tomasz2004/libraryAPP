package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Czytelnik;
import com.postgresql.libraryAPI.repository.CzytelnikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/czytelnicy")
@CrossOrigin(origins = "*")
public class CzytelnikController {
    
    @Autowired
    private CzytelnikRepository czytelnikRepository;
    
    // GET wszystkich czytelników
    @GetMapping
    public ResponseEntity<List<Czytelnik>> getAllCzytelnicy(
            @RequestParam(required = false) Boolean aktywny,
            @RequestParam(required = false) String filterType) {
        
        // Filtr według aktywnych wypożyczeń
        if ("activeLoans".equals(filterType)) {
            return ResponseEntity.ok(czytelnikRepository.findCzytelniciWithActiveLoans());
        }
        
        if ("noActiveLoans".equals(filterType)) {
            return ResponseEntity.ok(czytelnikRepository.findCzytelniciWithoutActiveLoans());
        }
        
        // Filtr według aktywności konta
        if (aktywny != null) {
            return ResponseEntity.ok(czytelnikRepository.findByAktywny(aktywny));
        }
        
        return ResponseEntity.ok(czytelnikRepository.findAll());
    }
    
    // GET czytelnika po ID
    @GetMapping("/{id}")
    public ResponseEntity<Czytelnik> getCzytelnikById(@PathVariable Integer id) {
        return czytelnikRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // GET czytelników z aktywnymi wypożyczeniami
    @GetMapping("/active-loans")
    public ResponseEntity<List<Czytelnik>> getCzytelniciWithActiveLoans() {
        return ResponseEntity.ok(czytelnikRepository.findCzytelniciWithActiveLoans());
    }
    
    // GET czytelników bez aktywnych wypożyczeń
    @GetMapping("/no-active-loans")
    public ResponseEntity<List<Czytelnik>> getCzytelniciWithoutActiveLoans() {
        return ResponseEntity.ok(czytelnikRepository.findCzytelniciWithoutActiveLoans());
    }
}
