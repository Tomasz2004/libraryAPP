package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Wypozyczenie;
import com.postgresql.libraryAPI.repository.WypozyczenieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/wypozyczenia")
@CrossOrigin(origins = "*")
public class WypozyczenieController {
    
    @Autowired
    private WypozyczenieRepository wypozyczenieRepository;
    
    // GET wszystkich wypożyczeń
    @GetMapping
    public ResponseEntity<List<Wypozyczenie>> getAllWypozyczenia() {
        return ResponseEntity.ok(wypozyczenieRepository.findAll());
    }
    
    // GET wypożyczenia po ID
    @GetMapping("/{id}")
    public ResponseEntity<Wypozyczenie> getWypozyczenieById(@PathVariable Integer id) {
        return wypozyczenieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * FORMULARZ: Lista wypożyczeń z filtrowaniem po zakresie dat („od-do") oraz po wybranym użytkowniku
     * Parametry (wszystkie opcjonalne):
     * - dataOd: data początkowa zakresu (format: YYYY-MM-DD)
     * - dataDo: data końcowa zakresu (format: YYYY-MM-DD)
     * - czytelnikId: ID czytelnika
     */
    @GetMapping("/search")
    public ResponseEntity<List<Wypozyczenie>> searchWypozyczenia(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataOd,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataDo,
            @RequestParam(required = false) Integer czytelnikId) {
        
        return ResponseEntity.ok(wypozyczenieRepository.searchWypozyczenia(dataOd, dataDo, czytelnikId));
    }
    
    // GET wypożyczeń danego czytelnika
    @GetMapping("/czytelnik/{czytelnikId}")
    public ResponseEntity<List<Wypozyczenie>> getByCzytelnik(@PathVariable Integer czytelnikId) {
        return ResponseEntity.ok(wypozyczenieRepository.findByCzytelnikCzytelnikId(czytelnikId));
    }
    
    // GET aktywnych wypożyczeń (nie zwrócone)
    @GetMapping("/aktywne")
    public ResponseEntity<List<Wypozyczenie>> getAktywne() {
        return ResponseEntity.ok(wypozyczenieRepository.findByDataZwrotuIsNull());
    }
    
    // GET zwróconych wypożyczeń
    @GetMapping("/zwrocone")
    public ResponseEntity<List<Wypozyczenie>> getZwrocone() {
        return ResponseEntity.ok(wypozyczenieRepository.findByDataZwrotuIsNotNull());
    }
}
