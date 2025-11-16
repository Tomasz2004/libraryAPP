package com.postgresql.libraryAPI.repository;

import com.postgresql.libraryAPI.model.Biblioteka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BibliotekaRepository extends JpaRepository<Biblioteka, Integer> {
}
