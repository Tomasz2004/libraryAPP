package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Czytelnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CzytelnikRepository extends JpaRepository<Czytelnik, Integer> {
    
    List<Czytelnik> findByAktywny(Boolean aktywny);
    
    // Czytelnicy z aktywnymi wypożyczeniami (brak data_zwrotu)
    @Query("SELECT DISTINCT c FROM Czytelnik c JOIN Wypozyczenie w ON c.czytelnikId = w.czytelnik.czytelnikId WHERE w.dataZwrotu IS NULL")
    List<Czytelnik> findCzytelniciWithActiveLoans();
    
    // Czytelnicy bez aktywnych wypożyczeń
    @Query("SELECT c FROM Czytelnik c WHERE c.czytelnikId NOT IN (SELECT w.czytelnik.czytelnikId FROM Wypozyczenie w WHERE w.dataZwrotu IS NULL)")
    List<Czytelnik> findCzytelniciWithoutActiveLoans();
}
