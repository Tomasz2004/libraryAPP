package com.postgresql.libraryAPI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "biblioteki")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Biblioteka {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "biblioteka_id")
    private Integer bibliotekaId;
    
    @Column(name = "nazwa", nullable = false, length = 200)
    private String nazwa;
    
    @Column(name = "adres", columnDefinition = "TEXT")
    private String adres;
}
