package com.postgresql.libraryAPI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "autorzy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Autor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "autor_id")
    private Integer autorId;
    
    @Column(name = "imie", length = 100)
    private String imie;
    
    @Column(name = "nazwisko", nullable = false, length = 150)
    private String nazwisko;
    
    @Column(name = "data_urodzenia")
    private LocalDate dataUrodzenia;
    
    @Column(name = "kraj", length = 100)
    private String kraj;
}
