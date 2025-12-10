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
public class BibliotekaCreateDTO {
    private String nazwa;
    private String adres;
}
