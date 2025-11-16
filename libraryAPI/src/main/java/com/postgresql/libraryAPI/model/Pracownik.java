package com.postgresql.libraryAPI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "pracownicy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pracownik {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pracownik_id")
    private Integer pracownikId;
    
    @Column(name = "imie", length = 100)
    private String imie;
    
    @Column(name = "nazwisko", nullable = false, length = 150)
    private String nazwisko;
    
    @Column(name = "stanowisko", length = 100)
    private String stanowisko;
    
    @ManyToOne
    @JoinColumn(name = "biblioteka_id", nullable = false)
    private Biblioteka biblioteka;
    
    @Column(name = "zatrudniony_od")
    private LocalDate zatrudnionyOd;
}
