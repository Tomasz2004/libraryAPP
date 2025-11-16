package com.postgresql.libraryAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dla wyszukiwania książek - zawiera informacje o książce i autorze
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KsiazkaSearchDTO {
    private Integer ksiazkaId;
    private String tytul;
    private String autorImie;
    private String autorNazwisko;
    private String gatunek;
    private Integer rokWydania;
    private String isbn;
    private Integer dostepneEgzemplarze;
}
