package com.example.resumebuilder.repository

import com.example.resumebuilder.api.RetrofitClient

import com.example.resumebuilder.models.Job
import com.example.resumebuilder.models.JobCategory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class JobRepository {
    private val apiService = RetrofitClient.jobsApiService

    suspend fun getJobs(): Result<List<Job>> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getJobs()
            if (response.isSuccessful) {
                val jobs = response.body()?.jobs ?: emptyList()
                Result.success(jobs)
            } else {
                Result.failure(Exception("Failed to fetch jobs: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getJobsByCategory(category: JobCategory): Result<List<Job>> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getJobs()
            if (response.isSuccessful) {
                val allJobs = response.body()?.jobs ?: emptyList()
                val filteredJobs = if (category == JobCategory.SOFTWARE_ENGINEER) {
                    allJobs.filter { it.getCategory() == JobCategory.SOFTWARE_ENGINEER }
                } else if (category == JobCategory.PYTHON_DEVELOPER) {
                    allJobs.filter { it.getCategory() == JobCategory.PYTHON_DEVELOPER }
                } else {
                    allJobs.filter { it.getCategory() == JobCategory.AI_ENGINEER }
                }
                Result.success(filteredJobs)
            } else {
                Result.failure(Exception("Failed to fetch jobs: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

