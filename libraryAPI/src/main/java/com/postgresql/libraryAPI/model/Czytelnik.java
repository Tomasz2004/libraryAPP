package com.postgresql.libraryAPI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "czytelnicy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Czytelnik {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "czytelnik_id")
    private Integer czytelnikId;
    
    @Column(name = "imie", length = 100)
    private String imie;
    
    @Column(name = "nazwisko", length = 150)
    private String nazwisko;
    
    @Column(name = "email", length = 200)
    private String email;
    
    @Column(name = "telefon", length = 40)
    private String telefon;
    
    @Column(name = "data_rejestracji")
    private LocalDate dataRejestracji;
    
    @Column(name = "aktywny")
    private Boolean aktywny = true;
}
