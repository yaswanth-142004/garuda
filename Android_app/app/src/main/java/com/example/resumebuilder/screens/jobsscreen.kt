package com.example.resumebuilder.screens

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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.example.resumebuilder.components.BottomNavBar
import com.example.resumebuilder.components.TopAppBarWithActions
import com.example.resumebuilder.models.Job
import com.example.resumebuilder.models.JobCategory
import com.example.resumebuilder.repository.JobRepository

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JobsScreen(
    onNavigateToResumes: () -> Unit,
    onNavigateToChatbot: () -> Unit
) {
    val repository = remember { JobRepository() }
    var jobs by remember { mutableStateOf<List<Job>>(emptyList()) }
    var filteredJobs by remember { mutableStateOf<List<Job>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var selectedCategory by remember { mutableStateOf<JobCategory?>(null) }

    LaunchedEffect(key1 = Unit) {
        try {
            isLoading = true
            repository.getJobs().fold(
                onSuccess = {
                    jobs = it
                    filteredJobs = it
                    isLoading = false
                },
                onFailure = {
                    error = it.message
                    isLoading = false
                    // For demo purposes, add some sample jobs if API fails
                    val sampleJobs = getSampleJobs()
                    jobs = sampleJobs
                    filteredJobs = sampleJobs
                }
            )
        } catch (e: Exception) {
            error = e.message
            isLoading = false
            // For demo purposes, add some sample jobs if API fails
            val sampleJobs = getSampleJobs()
            jobs = sampleJobs
            filteredJobs = sampleJobs
        }
    }

    LaunchedEffect(key1 = selectedCategory, key2 = jobs) {
        filteredJobs = if (selectedCategory == null) {
            jobs
        } else {
            jobs.filter { it.getCategory() == selectedCategory }
        }
    }

    Scaffold(
        topBar = {
            TopAppBarWithActions(
                title = "Job Recommendations",
                onMenuClick = { /* Open drawer or menu */ },
                onActionClick = { /* Refresh jobs */ },
                showAction = false
            )
        },
        bottomBar = {
            BottomNavBar(
                currentRoute = "jobs",
                onNavigate = { route ->
                    when (route) {
                        "resume_list" -> onNavigateToResumes()
                        "chatbot" -> onNavigateToChatbot()
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Category filter chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = selectedCategory == null,
                    onClick = { selectedCategory = null },
                    label = { Text("All Jobs") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )

                FilterChip(
                    selected = selectedCategory == JobCategory.SOFTWARE_ENGINEER,
                    onClick = { selectedCategory = JobCategory.SOFTWARE_ENGINEER },
                    label = { Text(JobCategory.SOFTWARE_ENGINEER.displayName) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )

                FilterChip(
                    selected = selectedCategory == JobCategory.PYTHON_DEVELOPER,
                    onClick = { selectedCategory = JobCategory.PYTHON_DEVELOPER },
                    label = { Text(JobCategory.PYTHON_DEVELOPER.displayName) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )

                FilterChip(
                    selected = selectedCategory == JobCategory.AI_ENGINEER,
                    onClick = { selectedCategory = JobCategory.AI_ENGINEER },
                    label = { Text(JobCategory.AI_ENGINEER.displayName) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )
            }

            Box(
                modifier = Modifier.fillMaxSize()
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                } else if (error != null && filteredJobs.isEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "Error loading jobs",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.error
                        )
                        Text(
                            text = error ?: "Unknown error",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                } else if (filteredJobs.isEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "No jobs found",
                            style = MaterialTheme.typography.bodyLarge
                        )
                        if (selectedCategory != null) {
                            Text(
                                text = "Try selecting a different category",
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(filteredJobs) { job ->
                            JobCard(job = job)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun JobCard(job: Job) {
    val uriHandler = LocalUriHandler.current

    Card(
        modifier = Modifier.fillMaxWidth(),
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
                    text = job.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )

                Spacer(modifier = Modifier.width(8.dp))

                IconButton(
                    onClick = {
                        try {
                            uriHandler.openUri(job.link)
                        } catch (e: Exception) {
                            // Handle error opening URL
                        }
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.OpenInNew,
                        contentDescription = "Open Job Listing"
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = job.company,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.primary
            )

            if (job.location != "Not specified" && job.location.isNotBlank()) {
                Text(
                    text = job.location,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Divider()

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Posted: ${job.post_date}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Text(
                    text = "Source: ${job.source}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            TextButton(
                onClick = {
                    try {
                        uriHandler.openUri(job.link)
                    } catch (e: Exception) {
                        // Handle error opening URL
                    }
                },
                modifier = Modifier.align(Alignment.End)
            ) {
                Text("Apply Now")
            }
        }
    }
}

private fun getSampleJobs(): List<Job> {
    // Sample data for demonstration purposes
    return listOf(
        Job(
            title = "Software Engineer- Systematic Trading- $150,000-200,000 + bonus!",
            company = "Saragossa",
            link = "https://www.linkedin.com/jobs/view/software-engineer-systematic-trading-%24150-000-200-000-%2B-bonus%21-at-saragossa-4165624380",
            source = "LinkedIn",
            post_date = "Recent",
            keyword = "",
            location = "New York, NY"
        ),
        Job(
            title = "Senior Python Developer",
            company = "TechCorp",
            link = "https://example.com/job/python-developer",
            source = "Indeed",
            post_date = "2 days ago",
            keyword = "python",
            location = "Remote"
        ),
        Job(
            title = "AI Engineer - Machine Learning",
            company = "AI Solutions",
            link = "https://example.com/job/ai-engineer",
            source = "LinkedIn",
            post_date = "1 week ago",
            keyword = "ai",
            location = "San Francisco, CA"
        ),
        Job(
            title = "Full Stack Software Engineer",
            company = "StartupXYZ",
            link = "https://example.com/job/fullstack-engineer",
            source = "AngelList",
            post_date = "3 days ago",
            keyword = "",
            location = "Austin, TX"
        ),
        Job(
            title = "Python Data Scientist",
            company = "DataCorp",
            link = "https://example.com/job/python-data-scientist",
            source = "Glassdoor",
            post_date = "Recent",
            keyword = "python",
            location = "Chicago, IL"
        ),
        Job(
            title = "AI Research Engineer",
            company = "Research Labs",
            link = "https://example.com/job/ai-research",
            source = "LinkedIn",
            post_date = "5 days ago",
            keyword = "ai",
            location = "Boston, MA"
        )
    )
}

