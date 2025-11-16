package com.postgresql.libraryAPI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ksiazki")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ksiazka {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ksiazka_id")
    private Integer ksiazkaId;
    
    @Column(name = "tytul", nullable = false, length = 300)
    private String tytul;
    
    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private Autor autor;
    
    @Column(name = "gatunek", length = 100)
    private String gatunek;
    
    @Column(name = "rok_wydania")
    private Integer rokWydania;
    
    @Column(name = "isbn", length = 20)
    private String isbn;
    
    @Column(name = "opis", columnDefinition = "TEXT")
    private String opis;
}
