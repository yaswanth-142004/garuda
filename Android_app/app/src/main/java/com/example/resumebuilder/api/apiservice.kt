package com.example.resumebuilder.api


import com.example.resumebuilder.api.models.ChatRequest
import com.example.resumebuilder.api.models.ChatResponse

import com.example.resumebuilder.models.JobResponse
import com.example.resumebuilder.models.Resume
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {
    // Resume endpoints
    @GET("resumes")
    suspend fun getResumes(@Query("userId") userId: String): Response<List<Resume>>

    @GET("resumes/{id}")
    suspend fun getResumeById(@Path("id") id: String): Response<Resume>

    @POST("resumes")
    suspend fun createResume(@Body resume: Resume): Response<Resume>

    @PUT("resumes/{id}")
    suspend fun updateResume(@Path("id") id: String, @Body resume: Resume): Response<Resume>

    @DELETE("resumes/{id}")
    suspend fun deleteResume(@Path("id") id: String): Response<Unit>

    // Jobs endpoints
    @GET("jobs")
    suspend fun getJobs(): Response<JobResponse>

    // Chatbot endpoints
    @POST("chat")
    suspend fun sendChatMessage(@Body request: ChatRequest): Response<ChatResponse>
}

