package com.example.webgis_service.dto;

import lombok.Data;
import tools.jackson.databind.JsonNode;
@Data
public class IntersectionRequest {
    private JsonNode layerFeatures;
    private JsonNode drawFeatures;

    public JsonNode getLayerFeatures() {
        return layerFeatures;
    }

    public void setLayerFeatures(JsonNode layerFeatures) {
        this.layerFeatures = layerFeatures;
    }

    public JsonNode getDrawFeatures() {
        return drawFeatures;
    }

    public void setDrawFeatures(JsonNode drawFeatures) {
        this.drawFeatures = drawFeatures;
    }
}
