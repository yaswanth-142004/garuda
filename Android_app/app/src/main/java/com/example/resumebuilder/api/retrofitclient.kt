package com.example.resumebuilder.api


import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private const val RESUME_API_BASE_URL = "https://your-mongodb-api-url.com/"
    private const val JOBS_API_BASE_URL = "https://a520-2409-40f0-34-6da-da51-fc3b-287c-d0a4.ngrok-free.app/"
    private const val CHATBOT_API_BASE_URL = "https://your-ngrok-chatbot-url.com/"

    private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    val resumeApiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(RESUME_API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(ApiService::class.java)
    }

    val jobsApiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(JOBS_API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(ApiService::class.java)
    }

    val chatbotApiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(CHATBOT_API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(ApiService::class.java)
    }
}
