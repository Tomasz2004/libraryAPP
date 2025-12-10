package com.postgresql.libraryAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dla tworzenia/aktualizacji wypożyczenia
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KsiazkaCreateDTO {
    private String tytul;
    private Integer autorId;
    private String gatunek;
    private int rokWydania;
    private String isbn;
    private String opis;
}
