package com.example.webgis_service.controller;

import com.example.webgis_service.dto.IntersectionRequest;
import com.example.webgis_service.service.IntersectionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
public class IntersectionController {
    public final IntersectionService intersectionService;
    public IntersectionController(
            IntersectionService intersectionService
    ){
        this.intersectionService = intersectionService;
    }
    @PostMapping("/intersection")
    public String intersection(@RequestBody IntersectionRequest request){
        return intersectionService.intersection(
                request.getLayerFeatures(),
                request.getDrawFeatures()
        );
    }

}
