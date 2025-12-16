package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Pracownik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PracownikRepository extends JpaRepository<Pracownik, Integer> {
    // Liczenie pracowników dla danej biblioteki
    long countByBiblioteka_BibliotekaId(Integer bibliotekaId);
}
