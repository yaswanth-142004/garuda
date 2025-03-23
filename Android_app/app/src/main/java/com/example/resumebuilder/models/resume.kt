package com.example.resumebuilder.models

import java.util.Date

data class Resume(
    val id: String,
    val userId: String,
    val name: String,
    val createdAt: Date,
    val updatedAt: Date,
    val personalInfo: PersonalInfo,
    val education: List<Education>,
    val experience: List<Experience>,
    val skills: List<String>,
    val projects: List<Project>
)

data class PersonalInfo(
    val fullName: String,
    val email: String,
    val phone: String,
    val address: String,
    val linkedIn: String? = null,
    val github: String? = null,
    val portfolio: String? = null
)

data class Education(
    val institution: String,
    val degree: String,
    val fieldOfStudy: String,
    val startDate: Date,
    val endDate: Date? = null,
    val isCurrentlyStudying: Boolean = false,
    val gpa: Float? = null,
    val description: String? = null
)

data class Experience(
    val company: String,
    val position: String,
    val startDate: Date,
    val endDate: Date? = null,
    val isCurrentlyWorking: Boolean = false,
    val location: String? = null,
    val description: List<String>
)

data class Project(
    val name: String,
    val description: String,
    val technologies: List<String>,
    val link: String? = null,
    val startDate: Date? = null,
    val endDate: Date? = null
)

