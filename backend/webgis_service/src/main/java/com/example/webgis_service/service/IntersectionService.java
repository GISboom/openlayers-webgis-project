package com.example.webgis_service.service;

import tools.jackson.databind.JsonNode;

public interface IntersectionService {
    String intersection(
            JsonNode layerFeatures,
            JsonNode drawFeatures
    );
}
