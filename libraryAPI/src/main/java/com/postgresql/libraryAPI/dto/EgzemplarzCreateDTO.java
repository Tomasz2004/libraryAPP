package com.postgresql.libraryAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dla tworzenia/aktualizacji egzemplarza
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EgzemplarzCreateDTO {
    private Integer ksiazkaId;
    private Integer bibliotekaId;
    private String sygnatura;
    private String barcode;
    private String status;
}
