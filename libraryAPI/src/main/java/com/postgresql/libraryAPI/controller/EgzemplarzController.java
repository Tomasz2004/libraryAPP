package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Egzemplarz;
import com.postgresql.libraryAPI.repository.EgzemplarzRepository;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
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

    /**
     * GET wszystkich egzemplarzy z opcjonalnymi filtrami
     * Parametry (opcjonalne):
     * - status: dostepny/wypozyczony/zablokowany
     * - bibliotekaId: ID biblioteki
     * - ksiazkaId: ID książki
     */
    @GetMapping
    public ResponseEntity<List<Egzemplarz>> getAllEgzemplarze(
            @Parameter(description = "Status egzemplarza", schema = @Schema(allowableValues = { "dostepny",
                    "wypozyczony", "zablokowany" })) @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer bibliotekaId,
            @RequestParam(required = false) Integer ksiazkaId) {

        return ResponseEntity.ok(egzemplarzRepository.searchEgzemplarze(status, bibliotekaId, ksiazkaId));
    }

    // GET egzemplarza po ID
    @GetMapping("/{id}")
    public ResponseEntity<Egzemplarz> getEgzemplarzById(@PathVariable Integer id) {
        return egzemplarzRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
