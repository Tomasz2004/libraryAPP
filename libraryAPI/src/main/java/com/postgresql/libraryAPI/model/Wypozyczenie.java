package com.postgresql.libraryAPI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "wypozyczenia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wypozyczenie {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wypozyczenie_id")
    private Integer wypozyczenieId;
    
    @ManyToOne
    @JoinColumn(name = "egzemplarz_id", nullable = false)
    private Egzemplarz egzemplarz;
    
    @ManyToOne
    @JoinColumn(name = "czytelnik_id", nullable = false)
    private Czytelnik czytelnik;
    
    @ManyToOne
    @JoinColumn(name = "pracownik_id", nullable = false)
    private Pracownik pracownik;
    
    @Column(name = "data_wypozyczenia", nullable = false)
    private LocalDate dataWypozyczenia = LocalDate.now();
    
    @Column(name = "termin_zwrotu")
    private LocalDate terminZwrotu;
    
    @Column(name = "data_zwrotu")
    private LocalDate dataZwrotu;
    
    @Column(name = "uwagi", columnDefinition = "TEXT")
    private String uwagi;
}
