package com.example.resumebuilder.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.resumebuilder.api.models.ChatMessage
import com.example.resumebuilder.components.BottomNavBar
import com.example.resumebuilder.components.TopAppBarWithActions
import com.example.resumebuilder.repository.ChatRepository

import kotlinx.coroutines.launch
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatbotScreen(
    onNavigateToResumes: () -> Unit,
    onNavigateToJobs: () -> Unit
) {
    val repository = remember { ChatRepository() }
    val messages = remember { mutableStateListOf<ChatMessage>() }
    var messageText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()

    // Hardcoded user ID for demo purposes
    val userId = "user123"

    // Add welcome message when screen is first displayed
    LaunchedEffect(key1 = Unit) {
        if (messages.isEmpty()) {
            messages.add(
                ChatMessage(
                    id = UUID.randomUUID().toString(),
                    content = "Hello! I'm your interview preparation assistant. I can help you practice for job interviews. What position are you preparing for?",
                    isFromUser = false
                )
            )
        }
    }

    // Scroll to bottom when new message is added
    LaunchedEffect(key1 = messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Scaffold(
        topBar = {
            TopAppBarWithActions(
                title = "Interview Preparation",
                onMenuClick = { /* Open drawer or menu */ },
                onActionClick = { /* Clear chat */ },
                showAction = false
            )
        },
        bottomBar = {
            BottomNavBar(
                currentRoute = "chatbot",
                onNavigate = { route ->
                    when (route) {
                        "resume_list" -> onNavigateToResumes()
                        "jobs" -> onNavigateToJobs()
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
            // Chat messages
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                state = listState,
                contentPadding = PaddingValues(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(messages) { message ->
                    ChatMessageItem(message = message)
                }
            }

            // Message input
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = messageText,
                    onValueChange = { messageText = it },
                    placeholder = { Text("Type your message...") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(24.dp)
                )

                Spacer(modifier = Modifier.size(8.dp))

                IconButton(
                    onClick = {
                        if (messageText.isNotBlank() && !isLoading) {
                            val userMessage = ChatMessage(
                                id = UUID.randomUUID().toString(),
                                content = messageText,
                                isFromUser = true
                            )
                            messages.add(userMessage)
                            val userMessageText = messageText
                            messageText = ""
                            isLoading = true

                            coroutineScope.launch {
                                // Try to get response from API
                                try {
                                    repository.sendMessage(userMessageText, userId).fold(
                                        onSuccess = { response ->
                                            messages.add(response)
                                        },
                                        onFailure = {
                                            // If API fails, use mock response
                                            val mockResponse = getMockResponse(userMessageText)
                                            messages.add(
                                                ChatMessage(
                                                    id = UUID.randomUUID().toString(),
                                                    content = mockResponse,
                                                    isFromUser = false
                                                )
                                            )
                                        }
                                    )
                                } catch (e: Exception) {
                                    // Fallback to mock response
                                    val mockResponse = getMockResponse(userMessageText)
                                    messages.add(
                                        ChatMessage(
                                            id = UUID.randomUUID().toString(),
                                            content = mockResponse,
                                            isFromUser = false
                                        )
                                    )
                                } finally {
                                    isLoading = false
                                }
                            }
                        }
                    },
                    modifier = Modifier
                        .size(48.dp)
                        .background(
                            color = MaterialTheme.colorScheme.primary,
                            shape = CircleShape
                        )
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(24.dp),
                            color = MaterialTheme.colorScheme.onPrimary,
                            strokeWidth = 2.dp
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.Send,
                            contentDescription = "Send",
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ChatMessageItem(message: ChatMessage) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (message.isFromUser) Arrangement.End else Arrangement.Start
    ) {
        Card(
            modifier = Modifier.widthIn(max = 300.dp),
            shape = RoundedCornerShape(
                topStart = if (message.isFromUser) 16.dp else 0.dp,
                topEnd = if (message.isFromUser) 0.dp else 16.dp,
                bottomStart = 16.dp,
                bottomEnd = 16.dp
            ),
            colors = CardDefaults.cardColors(
                containerColor = if (message.isFromUser)
                    MaterialTheme.colorScheme.primary
                else
                    MaterialTheme.colorScheme.secondaryContainer
            )
        ) {
            Text(
                text = message.content,
                modifier = Modifier.padding(12.dp),
                color = if (message.isFromUser)
                    MaterialTheme.colorScheme.onPrimary
                else
                    MaterialTheme.colorScheme.onSecondaryContainer
            )
        }
    }
}

private fun getMockResponse(userMessage: String): String {
    // Simple mock responses for demonstration purposes
    val lowerCaseMessage = userMessage.lowercase()

    return when {
        lowerCaseMessage.contains("software engineer") || lowerCaseMessage.contains("developer") ->
            "For a software engineering interview, you should prepare for technical questions about data structures, algorithms, and system design. Can you tell me what specific technologies you're familiar with?"

        lowerCaseMessage.contains("python") ->
            "For Python developer positions, be ready to discuss your experience with Python libraries and frameworks. How comfortable are you with libraries like NumPy, Pandas, or frameworks like Django and Flask?"

        lowerCaseMessage.contains("ai") || lowerCaseMessage.contains("machine learning") ->
            "For AI engineering roles, interviewers often ask about your experience with machine learning algorithms, deep learning frameworks, and data preprocessing. What projects have you worked on in this field?"

        lowerCaseMessage.contains("project") || lowerCaseMessage.contains("experience") ->
            "It's great to prepare specific examples of projects you've worked on. Can you walk me through one of your most challenging projects and how you overcame obstacles?"

        lowerCaseMessage.contains("strength") || lowerCaseMessage.contains("weakness") ->
            "When discussing strengths, focus on skills relevant to the job. For weaknesses, mention something you're actively improving. Can you share an example of how you've grown professionally in the past year?"

        lowerCaseMessage.contains("question") && (lowerCaseMessage.contains("ask") || lowerCaseMessage.contains("interviewer")) ->
            "Good questions to ask interviewers include: What does success look like in this role? How is performance measured? What are the biggest challenges the team is facing? Is there anything about my background that makes you hesitate about my fit for this role?"

        lowerCaseMessage.contains("thank") ->
            "You're welcome! Good luck with your interview preparation. Is there anything else you'd like to practice?"

        lowerCaseMessage.contains("hello") || lowerCaseMessage.contains("hi") ->
            "Hello! I'm here to help you prepare for your interviews. What type of position are you interviewing for?"

        else ->
            "That's a good point to consider for your interview. Would you like to practice answering some common interview questions for your field? Or would you prefer tips on how to structure your responses using the STAR method (Situation, Task, Action, Result)?"
    }
}

