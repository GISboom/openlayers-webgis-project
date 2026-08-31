package com.example.webgis_service.dto;
import tools.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class BufferRequest {
    private JsonNode geometry;
    private Double distance;

    public JsonNode getGeometry() {
        return geometry;
    }

    public void setGeometry(JsonNode geometry) {
        this.geometry = geometry;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }
}