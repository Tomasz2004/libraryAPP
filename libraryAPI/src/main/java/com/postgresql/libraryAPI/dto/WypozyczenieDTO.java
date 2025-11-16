package com.postgresql.libraryAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO dla wypożyczeń - zawiera pełne informacje o wypożyczeniu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WypozyczenieDTO {
    private Integer wypozyczenieId;
    private String barcode;
    private String tytulKsiazki;
    private String autorNazwisko;
    private String czytelnikImie;
    private String czytelnikNazwisko;
    private String pracownikImie;
    private String pracownikNazwisko;
    private LocalDate dataWypozyczenia;
    private LocalDate terminZwrotu;
    private LocalDate dataZwrotu;
    private String uwagi;
    private String status; // aktywne/zwrocone
}
