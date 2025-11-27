package com.klipy.data.dto

import com.google.gson.annotations.SerializedName

data class CategoriesResponseDto(
    @SerializedName("result")
    val result: Boolean? = null,
    @SerializedName("data")
    val data: CategoriesDataDto? = null
)

data class CategoriesDataDto(
    @SerializedName("locale")
    val locale: String? = null,
    @SerializedName("categories")
    val categories: List<CategoryItemDto>? = null
)

data class CategoryItemDto(
    @SerializedName("category")
    val category: String? = null,
    @SerializedName("query")
    val query: String? = null,
    @SerializedName("preview_url")
    val previewUrl: String? = null
)