package com.postgresql.libraryAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO dla tworzenia/aktualizacji wypożyczenia
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracownikCreateDTO {
    private String imie;
    private String nazwisko;
    private String stanowisko;
    private Integer bibliotekaId;
    private LocalDate zatrudnionyOd;
}
