package com.example.webgis_service.service.impl;

import com.example.webgis_service.repository.BufferRepository;
import com.example.webgis_service.service.BufferService;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

@Service
public class BufferServiceImpl implements BufferService {
    private final BufferRepository bufferRepository;

    public BufferServiceImpl(BufferRepository bufferRepository) {
        this.bufferRepository = bufferRepository;
    }
    @Override
    public String buffer(JsonNode geometry,Double distance){
        if (geometry == null) {
            throw new IllegalArgumentException("geometry不能为空");
        }

        if (distance == null || distance <= 0) {
            throw new IllegalArgumentException("缓冲距离必须大于0");
        }

        System.out.println("geometry = " + geometry);
        System.out.println("distance = " + distance);
        return bufferRepository.buffer(
                geometry.toString(),
                distance
        );
    };
}