package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Pracownik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PracownikRepository extends JpaRepository<Pracownik, Integer> {
    
    List<Pracownik> findByBibliotekaBibliotekaId(Integer bibliotekaId);
    
    List<Pracownik> findByStanowisko(String stanowisko);
}
