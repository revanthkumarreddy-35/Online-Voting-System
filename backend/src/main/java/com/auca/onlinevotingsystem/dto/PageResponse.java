package com.auca.onlinevotingsystem.dto;


import lombok.Data;

import java.util.List;

@Data
public class PageResponse<T> {
    public PageResponse(List<T> content, int currentPage, int totalPages, long totalElements) {
    }

}
