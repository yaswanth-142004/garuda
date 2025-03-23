package com.example.resumebuilder

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.resumebuilder.screens.ChatbotScreen
import com.example.resumebuilder.screens.JobsScreen
import com.example.resumebuilder.screens.ResumeListScreen
import com.example.resumebuilder.ui.theme.ResumebuilderTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ResumebuilderTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ResumeBuilderApp()
                }
            }
        }
    }
}


@Composable
fun ResumeBuilderApp() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "resume_list") {
        composable("resume_list") {
            ResumeListScreen(
                onNavigateToJobs = { navController.navigate("jobs") },
                onNavigateToChatbot = { navController.navigate("chatbot") }
            )
        }
        composable("jobs") {
            JobsScreen(
                onNavigateToResumes = { navController.navigate("resume_list") },
                onNavigateToChatbot = { navController.navigate("chatbot") }
            )
        }
        composable("chatbot") {
            ChatbotScreen(
                onNavigateToResumes = { navController.navigate("resume_list") },
                onNavigateToJobs = { navController.navigate("jobs") }
            )
        }
    }
}


