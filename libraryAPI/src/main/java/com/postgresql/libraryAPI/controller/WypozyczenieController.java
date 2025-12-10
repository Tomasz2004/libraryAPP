package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Wypozyczenie;
import com.postgresql.libraryAPI.repository.WypozyczenieRepository;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
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

    /**
     * GET wszystkich wypożyczeń z opcjonalnymi filtrami
     * Parametry (wszystkie opcjonalne):
     * - dataOd: data początkowa zakresu (format: YYYY-MM-DD)
     * - dataDo: data końcowa zakresu (format: YYYY-MM-DD)
     * - czytelnikId: ID czytelnika
     * - status: aktywne/zwrocone
     */
    @GetMapping
    public ResponseEntity<List<Wypozyczenie>> getAllWypozyczenia(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataOd,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataDo,
            @RequestParam(required = false) Integer czytelnikId,
            @Parameter(description = "Status wypożyczenia", schema = @Schema(allowableValues = { "aktywne",
                    "zwrocone" })) @RequestParam(required = false) String status) {

        return ResponseEntity.ok(wypozyczenieRepository.searchWypozyczenia(dataOd, dataDo, czytelnikId, status));
    }

    // GET wypożyczenia po ID
    @GetMapping("/{id}")
    public ResponseEntity<Wypozyczenie> getWypozyczenieById(@PathVariable Integer id) {
        return wypozyczenieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
