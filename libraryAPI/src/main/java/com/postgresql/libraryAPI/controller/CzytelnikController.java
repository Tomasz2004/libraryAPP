package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.model.Czytelnik;
import com.postgresql.libraryAPI.repository.CzytelnikRepository;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
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

    /**
     * GET wszystkich czytelników z opcjonalnymi filtrami
     * Parametry (opcjonalne):
     * - loanStatus: active/none (status wypożyczeń)
     */
    @GetMapping
    public ResponseEntity<List<Czytelnik>> getAllCzytelnicy(
            @Parameter(description = "Status wypożyczeń", schema = @Schema(allowableValues = { "active",
                    "none" })) @RequestParam(required = false) String loanStatus) {

        return ResponseEntity.ok(czytelnikRepository.searchCzytelnicy(loanStatus));
    }

    // GET czytelnika po ID
    @GetMapping("/{id}")
    public ResponseEntity<Czytelnik> getCzytelnikById(@PathVariable Integer id) {
        return czytelnikRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
