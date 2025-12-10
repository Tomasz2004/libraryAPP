package com.postgresql.libraryAPI.controller;

import com.postgresql.libraryAPI.dto.AutorCreateDTO;
import com.postgresql.libraryAPI.model.Autor;
import com.postgresql.libraryAPI.repository.AutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/autorzy")
@CrossOrigin(origins = "*")
public class AutorController {

    @Autowired
    private AutorRepository autorRepository;

    // GET wszystkich autorów
    @GetMapping
    public ResponseEntity<List<Autor>> getAllAutorzy() {
        return ResponseEntity.ok(autorRepository.findAll());
    }

    // GET autora po ID
    @GetMapping("/{id}")
    public ResponseEntity<Autor> getAutorById(@PathVariable Integer id) {
        return autorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Autor> createAutor(@RequestBody AutorCreateDTO autor) {
        Autor newAutor = new Autor();
        newAutor.setImie(autor.getImie());
        newAutor.setNazwisko(autor.getNazwisko());
        newAutor.setDataUrodzenia(autor.getDataUrodzenia());
        newAutor.setKraj(autor.getKraj());
        Autor savedAutor = autorRepository.save(newAutor);
        return ResponseEntity.ok(savedAutor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Autor> updateAutor(@PathVariable Integer id, @RequestBody Autor autorDetails) {
        return autorRepository.findById(id).map(existingAutor -> {
            existingAutor.setImie(autorDetails.getImie());
            existingAutor.setNazwisko(autorDetails.getNazwisko());
            Autor updatedAutor = autorRepository.save(existingAutor);
            return ResponseEntity.ok(updatedAutor);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAutor(@PathVariable Integer id) {
        return autorRepository.findById(id).map(autor -> {
            autorRepository.delete(autor);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}