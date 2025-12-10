package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Egzemplarz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EgzemplarzRepository extends JpaRepository<Egzemplarz, Integer> {

       // Zaawansowane filtrowanie
       @Query("SELECT e FROM Egzemplarz e WHERE " +
                     "(:status IS NULL OR e.status = :status) AND " +
                     "(:bibliotekaId IS NULL OR e.biblioteka.bibliotekaId = :bibliotekaId) AND " +
                     "(:ksiazkaId IS NULL OR e.ksiazka.ksiazkaId = :ksiazkaId)")
       List<Egzemplarz> searchEgzemplarze(@Param("status") String status,
                     @Param("bibliotekaId") Integer bibliotekaId,
                     @Param("ksiazkaId") Integer ksiazkaId);
}
