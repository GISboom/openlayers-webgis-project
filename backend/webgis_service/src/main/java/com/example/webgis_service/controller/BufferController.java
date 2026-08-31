package com.example.webgis_service.controller;

import com.example.webgis_service.dto.BufferRequest;
import com.example.webgis_service.service.BufferService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis")
public class BufferController{
    private final BufferService bufferService;
    public BufferController(BufferService bufferService){
        this.bufferService = bufferService;
    }

    @PostMapping("/buffer")
    public String buffer(@RequestBody BufferRequest request){
        return bufferService.buffer(
                request.getGeometry(),
                request.getDistance()
        );
    }
}
