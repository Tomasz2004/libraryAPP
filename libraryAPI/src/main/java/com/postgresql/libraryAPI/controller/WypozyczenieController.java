package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.dto.WypozyczenieCreateDTO;
import com.postgresql.libraryAPI.model.Czytelnik;
import com.postgresql.libraryAPI.model.Egzemplarz;
import com.postgresql.libraryAPI.model.Pracownik;
import com.postgresql.libraryAPI.model.Wypozyczenie;
import com.postgresql.libraryAPI.repository.CzytelnikRepository;
import com.postgresql.libraryAPI.repository.EgzemplarzRepository;
import com.postgresql.libraryAPI.repository.PracownikRepository;
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

    @Autowired
    private EgzemplarzRepository egzemplarzRepository;

    @Autowired
    private CzytelnikRepository czytelnikRepository;

    @Autowired
    private PracownikRepository pracownikRepository;

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

    // POST - utworzenie nowego wypożyczenia
    @PostMapping
    public ResponseEntity<?> createWypozyczenie(@RequestBody WypozyczenieCreateDTO dto) {
        // Sprawdź czy egzemplarz istnieje
        Egzemplarz egzemplarz = egzemplarzRepository.findById(dto.getEgzemplarzId())
                .orElse(null);
        if (egzemplarz == null) {
            return ResponseEntity.badRequest().body("Egzemplarz o ID " + dto.getEgzemplarzId() + " nie istnieje");
        }

        // Sprawdź czy czytelnik istnieje
        Czytelnik czytelnik = czytelnikRepository.findById(dto.getCzytelnikId())
                .orElse(null);
        if (czytelnik == null) {
            return ResponseEntity.badRequest().body("Czytelnik o ID " + dto.getCzytelnikId() + " nie istnieje");
        }

        // Sprawdź czy pracownik istnieje
        Pracownik pracownik = pracownikRepository.findById(dto.getPracownikId())
                .orElse(null);
        if (pracownik == null) {
            return ResponseEntity.badRequest().body("Pracownik o ID " + dto.getPracownikId() + " nie istnieje");
        }

        // Utwórz wypożyczenie
        Wypozyczenie wypozyczenie = new Wypozyczenie();
        wypozyczenie.setEgzemplarz(egzemplarz);
        wypozyczenie.setCzytelnik(czytelnik);
        wypozyczenie.setPracownik(pracownik);
        wypozyczenie
                .setDataWypozyczenia(dto.getDataWypozyczenia() != null ? dto.getDataWypozyczenia() : LocalDate.now());
        wypozyczenie.setTerminZwrotu(dto.getTerminZwrotu());
        wypozyczenie.setDataZwrotu(dto.getDataZwrotu());
        wypozyczenie.setUwagi(dto.getUwagi());

        Wypozyczenie saved = wypozyczenieRepository.save(wypozyczenie);
        return ResponseEntity.ok(saved);
    }

    // PUT - aktualizacja wypożyczenia
    @PutMapping("/{id}")
    public ResponseEntity<?> updateWypozyczenie(@PathVariable Integer id, @RequestBody WypozyczenieCreateDTO dto) {
        return wypozyczenieRepository.findById(id)
                .map(existing -> {
                    // Sprawdź czy egzemplarz istnieje
                    Egzemplarz egzemplarz = egzemplarzRepository.findById(dto.getEgzemplarzId())
                            .orElse(null);
                    if (egzemplarz == null) {
                        return ResponseEntity.badRequest()
                                .body("Egzemplarz o ID " + dto.getEgzemplarzId() + " nie istnieje");
                    }

                    // Sprawdź czy czytelnik istnieje
                    Czytelnik czytelnik = czytelnikRepository.findById(dto.getCzytelnikId())
                            .orElse(null);
                    if (czytelnik == null) {
                        return ResponseEntity.badRequest()
                                .body("Czytelnik o ID " + dto.getCzytelnikId() + " nie istnieje");
                    }

                    // Sprawdź czy pracownik istnieje
                    Pracownik pracownik = pracownikRepository.findById(dto.getPracownikId())
                            .orElse(null);
                    if (pracownik == null) {
                        return ResponseEntity.badRequest()
                                .body("Pracownik o ID " + dto.getPracownikId() + " nie istnieje");
                    }

                    // Aktualizuj wypożyczenie
                    existing.setEgzemplarz(egzemplarz);
                    existing.setCzytelnik(czytelnik);
                    existing.setPracownik(pracownik);
                    if (dto.getDataWypozyczenia() != null) {
                        existing.setDataWypozyczenia(dto.getDataWypozyczenia());
                    }
                    existing.setTerminZwrotu(dto.getTerminZwrotu());
                    existing.setDataZwrotu(dto.getDataZwrotu());
                    existing.setUwagi(dto.getUwagi());

                    Wypozyczenie updated = wypozyczenieRepository.save(existing);
                    return ResponseEntity.ok().body(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - usunięcie wypożyczenia
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWypozyczenie(@PathVariable Integer id) {
        return wypozyczenieRepository.findById(id)
                .map(wypozyczenie -> {
                    wypozyczenieRepository.delete(wypozyczenie);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
