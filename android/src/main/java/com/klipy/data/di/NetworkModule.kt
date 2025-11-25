package com.klipy.data.di

import com.google.gson.GsonBuilder
import com.klipy.data.dto.MediaItemDto
import com.klipy.data.dto.deserializer.MediaItemDtoDeserializer
import com.klipy.data.infrastructure.interceptor.AdsQueryParametersInterceptor
import com.klipy.data.infrastructure.interceptor.ApiKeyBaseUrlInterceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.koin.dsl.module
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

val networkModule = module {
    single {
        GsonBuilder()
            .registerTypeAdapter(MediaItemDto::class.java, MediaItemDtoDeserializer())
            .create()
    }

    single {
        Retrofit.Builder()
            .baseUrl("https://api.klipy.com/api/v1/")
            .client(get())
            .addConverterFactory(GsonConverterFactory.create(get()))
            .build()
    }

    single {
        HttpLoggingInterceptor().apply {
            setLevel(HttpLoggingInterceptor.Level.BASIC)
        }
    }

    single {
        OkHttpClient.Builder()
            .addInterceptor(ApiKeyBaseUrlInterceptor())
            .addInterceptor(get<AdsQueryParametersInterceptor>())
            .addInterceptor(get<HttpLoggingInterceptor>())
            .readTimeout(30, TimeUnit.SECONDS)
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    single<AdsQueryParametersInterceptor> {
        AdsQueryParametersInterceptor(get(), get(), get())
    }
}