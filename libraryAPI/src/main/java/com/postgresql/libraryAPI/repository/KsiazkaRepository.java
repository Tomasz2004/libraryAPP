package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Ksiazka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KsiazkaRepository extends JpaRepository<Ksiazka, Integer> {

       // Zaawansowane wyszukiwanie - tytul, autor, gatunek lub rok
       @Query("SELECT k FROM Ksiazka k WHERE " +
                     "(:tytul IS NULL OR LOWER(k.tytul) LIKE :tytul) AND " +
                     "(:autor IS NULL OR LOWER(k.autor.nazwisko) LIKE :autor) AND " +
                     "(:gatunek IS NULL OR LOWER(k.gatunek) LIKE :gatunek) AND " +
                     "(:rokWydania IS NULL OR k.rokWydania = :rokWydania)")
       List<Ksiazka> searchKsiazki(@Param("tytul") String tytul,
                     @Param("autor") String autor,
                     @Param("gatunek") String gatunek,
                     @Param("rokWydania") Integer rokWydania);
}
