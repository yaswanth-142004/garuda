package com.example.resumebuilder.api.models

data class ChatMessage(
    val id: String,
    val content: String,
    val isFromUser: Boolean,
    val timestamp: Long = System.currentTimeMillis()
)

data class ChatRequest(
    val message: String,
    val userId: String
)

data class ChatResponse(
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)

