package com.example.forum.controller;

import com.example.forum.model.Message;
import com.example.forum.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Date;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // ✅ GET messages by topic
    @GetMapping
    public List<Message> getMessagesByTopic(@RequestParam String topic) {
        return messageRepository.findByTopic(topic);
    }

    // ✅ POST new message with `createdAt` set before saving
    @PostMapping
    public Message createMessage(@RequestBody Message message) {
        message.setCreatedAt(new Date()); // Ensure timestamp is set
        return messageRepository.save(message);
    }
}
