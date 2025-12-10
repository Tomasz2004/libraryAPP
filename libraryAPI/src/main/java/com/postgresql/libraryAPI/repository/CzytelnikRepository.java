package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Czytelnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CzytelnikRepository extends JpaRepository<Czytelnik, Integer> {

    // Zaawansowane filtrowanie
    @Query("SELECT DISTINCT c FROM Czytelnik c " +
            "LEFT JOIN Wypozyczenie w ON c.czytelnikId = w.czytelnik.czytelnikId AND w.dataZwrotu IS NULL " +
            "WHERE (:loanStatus IS NULL OR " +
            "  (:loanStatus = 'active' AND w.wypozyczenieId IS NOT NULL) OR " +
            "  (:loanStatus = 'none' AND w.wypozyczenieId IS NULL))")
    List<Czytelnik> searchCzytelnicy(@Param("loanStatus") String loanStatus);
}