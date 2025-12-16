package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.dto.CzytelnikCreateDTO;
import com.postgresql.libraryAPI.model.Czytelnik;
import com.postgresql.libraryAPI.repository.CzytelnikRepository;
import com.postgresql.libraryAPI.repository.WypozyczenieRepository;

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

    @Autowired
    private WypozyczenieRepository wypozyczenieRepository;

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

    @PostMapping
    public ResponseEntity<Czytelnik> createCzytelnik(@RequestBody CzytelnikCreateDTO dto) {
        Czytelnik newCzytelnik = new Czytelnik();
        newCzytelnik.setImie(dto.getImie());
        newCzytelnik.setNazwisko(dto.getNazwisko());
        newCzytelnik.setEmail(dto.getEmail());
        newCzytelnik.setTelefon(dto.getTelefon());
        newCzytelnik.setDataRejestracji(dto.getDataRejestracji());
        Czytelnik savedCzytelnik = czytelnikRepository.save(newCzytelnik);
        return ResponseEntity.ok(savedCzytelnik);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Czytelnik> updateCzytelnik(@PathVariable Integer id,
            @RequestBody Czytelnik czytelnikDetails) {
        return czytelnikRepository.findById(id).map(existingCzytelnik -> {
            existingCzytelnik.setImie(czytelnikDetails.getImie());
            existingCzytelnik.setNazwisko(czytelnikDetails.getNazwisko());
            existingCzytelnik.setEmail(czytelnikDetails.getEmail());
            existingCzytelnik.setTelefon(czytelnikDetails.getTelefon());
            Czytelnik updatedCzytelnik = czytelnikRepository.save(existingCzytelnik);
            return ResponseEntity.ok(updatedCzytelnik);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCzytelnik(@PathVariable Integer id,
            @RequestParam(required = false, defaultValue = "false") boolean cascade) {
        return czytelnikRepository.findById(id).map(czytelnik -> {
            long wypozyczeniaCount = wypozyczenieRepository.countByCzytelnik_CzytelnikId(id);
            if (wypozyczeniaCount > 0) {
                if (!cascade) {
                    return ResponseEntity.status(409)
                            .body("{\"message\": \"Czytelnik ma aktywne wypożyczenia\", \"count\": " + wypozyczeniaCount
                                    + "}");
                } else {
                    wypozyczenieRepository.findAll().stream()
                            .filter(w -> w.getCzytelnik().getCzytelnikId()
                                    .equals(czytelnik.getCzytelnikId()) && w.getDataZwrotu() == null)
                            .forEach(w -> wypozyczenieRepository.delete(w));
                }
            }
            czytelnikRepository.delete(czytelnik);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
