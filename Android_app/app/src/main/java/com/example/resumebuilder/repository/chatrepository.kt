package com.example.resumebuilder.repository

import com.example.resumebuilder.api.RetrofitClient
import com.example.resumebuilder.api.models.ChatMessage
import com.example.resumebuilder.api.models.ChatRequest

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.UUID

class ChatRepository {
    private val apiService = RetrofitClient.chatbotApiService

    suspend fun sendMessage(message: String, userId: String): Result<ChatMessage> = withContext(Dispatchers.IO) {
        try {
            val request = ChatRequest(message, userId)
            val response = apiService.sendChatMessage(request)

            if (response.isSuccessful) {
                val chatResponse = response.body()
                if (chatResponse != null) {
                    val chatMessage = ChatMessage(
                        id = UUID.randomUUID().toString(),
                        content = chatResponse.message,
                        isFromUser = false,
                        timestamp = chatResponse.timestamp
                    )
                    Result.success(chatMessage)
                } else {
                    Result.failure(Exception("Empty response from chatbot"))
                }
            } else {
                Result.failure(Exception("Failed to send message: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

