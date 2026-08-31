package com.example.webgis_service.service;

import tools.jackson.databind.JsonNode;
public interface BufferService {
    String buffer(JsonNode geometry,Double distance);
}