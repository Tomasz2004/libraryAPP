package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Wypozyczenie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WypozyczenieRepository extends JpaRepository<Wypozyczenie, Integer> {
    
    // Wypożyczenia danego czytelnika
    List<Wypozyczenie> findByCzytelnikCzytelnikId(Integer czytelnikId);
    
    // Aktywne wypożyczenia (nie zwrócone)
    List<Wypozyczenie> findByDataZwrotuIsNull();
    
    // Wypożyczenia zwrócone
    List<Wypozyczenie> findByDataZwrotuIsNotNull();
    
    // Zaawansowane filtrowanie po zakresie dat i użytkowniku
    @Query("SELECT w FROM Wypozyczenie w WHERE " +
           "(:dataOd IS NULL OR w.dataWypozyczenia >= :dataOd) AND " +
           "(:dataDo IS NULL OR w.dataWypozyczenia <= :dataDo) AND " +
           "(:czytelnikId IS NULL OR w.czytelnik.czytelnikId = :czytelnikId) " +
           "ORDER BY w.dataWypozyczenia DESC")
    List<Wypozyczenie> searchWypozyczenia(@Param("dataOd") LocalDate dataOd,
                                          @Param("dataDo") LocalDate dataDo,
                                          @Param("czytelnikId") Integer czytelnikId);
}
