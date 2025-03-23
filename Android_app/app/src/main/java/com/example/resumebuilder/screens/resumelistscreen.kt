package com.example.resumebuilder.screens


import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.example.resumebuilder.components.BottomNavBar
import com.example.resumebuilder.components.TopAppBarWithActions
import com.example.resumebuilder.models.Resume
import com.example.resumebuilder.repository.ResumeRepository

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ResumeListScreen(
    onNavigateToJobs: () -> Unit,
    onNavigateToChatbot: () -> Unit
) {
    val repository = remember { ResumeRepository() }
    var resumes by remember { mutableStateOf<List<Resume>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    // Hardcoded user ID for demo purposes
    val userId = "user123"

    LaunchedEffect(key1 = userId) {
        isLoading = true
        repository.getResumes(userId).fold(
            onSuccess = {
                resumes = it
                isLoading = false
            },
            onFailure = {
                error = it.message
                isLoading = false
                // For demo purposes, add some sample resumes if API fails
                resumes = getSampleResumes()
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBarWithActions(
                title = "My Resumes",
                onMenuClick = { /* Open drawer or menu */ },
                onActionClick = { /* Add new resume */ }
            )
        },
        bottomBar = {
            BottomNavBar(
                currentRoute = "resume_list",
                onNavigate = { route ->
                    when (route) {
                        "jobs" -> onNavigateToJobs()
                        "chatbot" -> onNavigateToChatbot()
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* Add new resume */ },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add Resume",
                    tint = MaterialTheme.colorScheme.onPrimary
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            } else if (error != null && resumes.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Error loading resumes",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.error
                    )
                    Text(
                        text = error ?: "Unknown error",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            } else if (resumes.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "No resumes found",
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Text(
                        text = "Create your first resume by clicking the + button",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(resumes) { resume ->
                        ResumeCard(
                            resume = resume,
                            onEditClick = { /* Navigate to edit resume */ },
                            onDeleteClick = { /* Delete resume */ }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ResumeCard(
    resume: Resume,
    onEditClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* View resume details */ },
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = resume.name,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )

                Row {
                    IconButton(onClick = onEditClick) {
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = "Edit Resume"
                        )
                    }

                    IconButton(onClick = onDeleteClick) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Resume"
                        )
                    }
                }
            }

            Divider(modifier = Modifier.padding(vertical = 8.dp))

            Text(
                text = "Personal Info",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Name: ${resume.personalInfo.fullName}",
                style = MaterialTheme.typography.bodyMedium
            )

            Text(
                text = "Email: ${resume.personalInfo.email}",
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .padding(end = 4.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.primaryContainer)
                        .padding(8.dp)
                ) {
                    Column {
                        Text(
                            text = "Experience",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Text(
                            text = "${resume.experience.size} entries",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .padding(start = 4.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.secondaryContainer)
                        .padding(8.dp)
                ) {
                    Column {
                        Text(
                            text = "Education",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                        Text(
                            text = "${resume.education.size} entries",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Last updated: ${formatDate(resume.updatedAt)}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

private fun formatDate(date: Date): String {
    val formatter = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
    return formatter.format(date)
}

private fun getSampleResumes(): List<Resume> {
    // Sample data for demonstration purposes
    return listOf(
        Resume(
            id = "1",
            userId = "user123",
            name = "Software Engineer Resume",
            createdAt = Date(),
            updatedAt = Date(),
            personalInfo = com.example.resumebuilder.models.PersonalInfo(
                fullName = "John Doe",
                email = "john.doe@example.com",
                phone = "123-456-7890",
                address = "123 Main St, City, Country",
                linkedIn = "linkedin.com/in/johndoe",
                github = "github.com/johndoe"
            ),
            education = listOf(
                com.example.resumebuilder.models.Education(
                    institution = "University of Technology",
                    degree = "Bachelor of Science",
                    fieldOfStudy = "Computer Science",
                    startDate = Date(),
                    endDate = Date(),
                    gpa = 3.8f
                )
            ),
            experience = listOf(
                com.example.resumebuilder.models.Experience(
                    company = "Tech Solutions Inc.",
                    position = "Software Engineer",
                    startDate = Date(),
                    endDate = null,
                    isCurrentlyWorking = true,
                    location = "San Francisco, CA",
                    description = listOf(
                        "Developed and maintained web applications",
                        "Collaborated with cross-functional teams",
                        "Implemented new features and fixed bugs"
                    )
                ),
                com.example.resumebuilder.models.Experience(
                    company = "Startup XYZ",
                    position = "Junior Developer",
                    startDate = Date(),
                    endDate = Date(),
                    isCurrentlyWorking = false,
                    location = "New York, NY",
                    description = listOf(
                        "Assisted in developing mobile applications",
                        "Participated in code reviews",
                        "Fixed bugs and improved performance"
                    )
                )
            ),
            skills = listOf("Java", "Kotlin", "Android", "Git", "REST APIs"),
            projects = listOf(
                com.example.resumebuilder.models.Project(
                    name = "E-commerce App",
                    description = "A mobile app for online shopping",
                    technologies = listOf("Kotlin", "Android", "Firebase"),
                    link = "github.com/johndoe/ecommerce"
                )
            )
        ),
        Resume(
            id = "2",
            userId = "user123",
            name = "Data Scientist Resume",
            createdAt = Date(),
            updatedAt = Date(),
            personalInfo = com.example.resumebuilder.models.PersonalInfo(
                fullName = "Jane Smith",
                email = "jane.smith@example.com",
                phone = "987-654-3210",
                address = "456 Oak St, City, Country",
                linkedIn = "linkedin.com/in/janesmith"
            ),
            education = listOf(
                com.example.resumebuilder.models.Education(
                    institution = "Data Science University",
                    degree = "Master of Science",
                    fieldOfStudy = "Data Science",
                    startDate = Date(),
                    endDate = Date(),
                    gpa = 4.0f
                )
            ),
            experience = listOf(
                com.example.resumebuilder.models.Experience(
                    company = "Data Analytics Corp.",
                    position = "Data Scientist",
                    startDate = Date(),
                    endDate = null,
                    isCurrentlyWorking = true,
                    location = "Seattle, WA",
                    description = listOf(
                        "Analyzed large datasets to extract insights",
                        "Built machine learning models",
                        "Presented findings to stakeholders"
                    )
                )
            ),
            skills = listOf("Python", "R", "Machine Learning", "SQL", "Tableau"),
            projects = listOf(
                com.example.resumebuilder.models.Project(
                    name = "Customer Segmentation",
                    description = "A project to segment customers based on behavior",
                    technologies = listOf("Python", "Scikit-learn", "Pandas"),
                    link = "github.com/janesmith/customer-segmentation"
                )
            )
        )
    )
}

