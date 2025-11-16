package com.postgresql.libraryAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO dla egzemplarzy - zawiera informacje o egzemplarzu, książce i bibliotece
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EgzemplarzDTO {
    private Integer egzemplarzId;
    private String barcode;
    private String sygnatura;
    private String tytulKsiazki;
    private String autorNazwisko;
    private String gatunek;
    private String bibliotekaNazwa;
    private String status;
    private LocalDate dataDodania;
}
