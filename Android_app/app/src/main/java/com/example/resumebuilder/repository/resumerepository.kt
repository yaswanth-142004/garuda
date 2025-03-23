package com.example.resumebuilder.repository

import com.example.resumebuilder.api.RetrofitClient
import com.example.resumebuilder.models.Resume
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ResumeRepository {
    private val apiService = RetrofitClient.resumeApiService

    suspend fun getResumes(userId: String): Result<List<Resume>> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getResumes(userId)
            if (response.isSuccessful) {
                Result.success(response.body() ?: emptyList())
            } else {
                Result.failure(Exception("Failed to fetch resumes: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getResumeById(id: String): Result<Resume> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getResumeById(id)
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Resume not found"))
            } else {
                Result.failure(Exception("Failed to fetch resume: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createResume(resume: Resume): Result<Resume> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.createResume(resume)
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Failed to create resume"))
            } else {
                Result.failure(Exception("Failed to create resume: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateResume(id: String, resume: Resume): Result<Resume> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.updateResume(id, resume)
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Failed to update resume"))
            } else {
                Result.failure(Exception("Failed to update resume: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteResume(id: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.deleteResume(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete resume: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

