package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.dto.EgzemplarzCreateDTO;
import com.postgresql.libraryAPI.model.Biblioteka;
import com.postgresql.libraryAPI.model.Egzemplarz;
import com.postgresql.libraryAPI.model.Ksiazka;
import com.postgresql.libraryAPI.repository.BibliotekaRepository;
import com.postgresql.libraryAPI.repository.EgzemplarzRepository;
import com.postgresql.libraryAPI.repository.KsiazkaRepository;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/egzemplarze")
@CrossOrigin(origins = "*")
public class EgzemplarzController {

    @Autowired
    private EgzemplarzRepository egzemplarzRepository;

    @Autowired
    private KsiazkaRepository ksiazkaRepository;

    @Autowired
    private BibliotekaRepository bibliotekaRepository;

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

    // POST - utworzenie nowego egzemplarza
    @PostMapping
    public ResponseEntity<?> createEgzemplarze(@RequestBody EgzemplarzCreateDTO dto) {
        // Sprawdź czy książka istnieje
        Ksiazka ksiazka = ksiazkaRepository.findById(dto.getKsiazkaId())
                .orElse(null);
        if (ksiazka == null) {
            return ResponseEntity.badRequest().body("Książka o ID " + dto.getKsiazkaId() + " nie istnieje");
        }

        // Sprawdź czy biblioteka istnieje
        Biblioteka biblioteka = bibliotekaRepository.findById(dto.getBibliotekaId())
                .orElse(null);
        if (biblioteka == null) {
            return ResponseEntity.badRequest().body("Biblioteka o ID " + dto.getBibliotekaId() + " nie istnieje");
        }

        // Utwórz egzemplarz
        Egzemplarz egzemplarz = new Egzemplarz();
        egzemplarz.setKsiazka(ksiazka);
        egzemplarz.setBiblioteka(biblioteka);
        egzemplarz.setSygnatura(dto.getSygnatura());
        egzemplarz.setBarcode(dto.getBarcode());
        egzemplarz.setStatus(dto.getStatus() != null ? dto.getStatus() : "dostepny");
        egzemplarz.setDataDodania(LocalDate.now());

        Egzemplarz savedEgzemplarz = egzemplarzRepository.save(egzemplarz);
        return ResponseEntity.ok(savedEgzemplarz);
    }

    // PUT - aktualizacja egzemplarza
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEgzemplarz(@PathVariable Integer id, @RequestBody EgzemplarzCreateDTO dto) {
        return egzemplarzRepository.findById(id)
                .map(existing -> {
                    // Sprawdź czy książka istnieje
                    Ksiazka ksiazka = ksiazkaRepository.findById(dto.getKsiazkaId())
                            .orElse(null);
                    if (ksiazka == null) {
                        return ResponseEntity.badRequest().body("Książka o ID " + dto.getKsiazkaId() + " nie istnieje");
                    }

                    // Sprawdź czy biblioteka istnieje
                    Biblioteka biblioteka = bibliotekaRepository.findById(dto.getBibliotekaId())
                            .orElse(null);
                    if (biblioteka == null) {
                        return ResponseEntity.badRequest()
                                .body("Biblioteka o ID " + dto.getBibliotekaId() + " nie istnieje");
                    }

                    // Aktualizuj egzemplarz
                    existing.setKsiazka(ksiazka);
                    existing.setBiblioteka(biblioteka);
                    existing.setSygnatura(dto.getSygnatura());
                    existing.setBarcode(dto.getBarcode());
                    if (dto.getStatus() != null) {
                        existing.setStatus(dto.getStatus());
                    }

                    Egzemplarz updated = egzemplarzRepository.save(existing);
                    return ResponseEntity.ok().body(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - usunięcie egzemplarza
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEgzemplarz(@PathVariable Integer id) {
        return egzemplarzRepository.findById(id)
                .map(egzemplarz -> {
                    egzemplarzRepository.delete(egzemplarz);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
