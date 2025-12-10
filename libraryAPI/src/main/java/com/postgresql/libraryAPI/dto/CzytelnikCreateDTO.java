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

public class CzytelnikCreateDTO {
    private String imie;
    private String nazwisko;
    private String email;
    private String telefon;
    private LocalDate dataRejestracji;
}
