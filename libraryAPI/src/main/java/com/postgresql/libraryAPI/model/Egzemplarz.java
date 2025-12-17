package com.postgresql.libraryAPI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "egzemplarze")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Egzemplarz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "egzemplarz_id")
    private Integer egzemplarzId;

    @ManyToOne
    @JoinColumn(name = "ksiazka_id", nullable = false)
    private Ksiazka ksiazka;

    @ManyToOne
    @JoinColumn(name = "biblioteka_id", nullable = false)
    private Biblioteka biblioteka;

    @Column(name = "sygnatura", length = 100)
    private String sygnatura;

    @Column(name = "barcode", length = 100, unique = true)
    private String barcode;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "Dostępny";

    @Column(name = "data_dodania")
    private LocalDate dataDodania = LocalDate.now();
}
