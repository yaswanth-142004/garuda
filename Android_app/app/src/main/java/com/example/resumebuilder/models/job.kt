package com.example.resumebuilder.models


data class JobResponse(
    val jobs: List<Job>
)

data class Job(
    val title: String,
    val company: String,
    val link: String,
    val source: String,
    val post_date: String,
    val keyword: String,
    val location: String
) {
    fun getCategory(): JobCategory {
        val titleLower = title.lowercase()
        return when {
            titleLower.contains("software engineer") ||
                    titleLower.contains("software developer") -> JobCategory.SOFTWARE_ENGINEER

            titleLower.contains("python") ||
                    titleLower.contains("python developer") -> JobCategory.PYTHON_DEVELOPER

            titleLower.contains("ai") ||
                    titleLower.contains("machine learning") ||
                    titleLower.contains("artificial intelligence") ||
                    titleLower.contains("ml") -> JobCategory.AI_ENGINEER

            else -> JobCategory.SOFTWARE_ENGINEER // Default category
        }
    }
}

enum class JobCategory(val displayName: String) {
    SOFTWARE_ENGINEER("Software Engineer"),
    PYTHON_DEVELOPER("Python Developer"),
    AI_ENGINEER("AI Engineer")
}

