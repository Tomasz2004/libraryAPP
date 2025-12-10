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
public class WypozyczenieCreateDTO {
    private Integer egzemplarzId;
    private Integer czytelnikId;
    private Integer pracownikId;
    private LocalDate dataWypozyczenia;
    private LocalDate terminZwrotu;
    private LocalDate dataZwrotu;
    private String uwagi;
}
