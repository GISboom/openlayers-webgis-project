package com.example.webgis_service.service.impl;

import com.example.webgis_service.service.IntersectionService;
import com.example.webgis_service.repository.IntersectionRepository;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

@Service
public class IntersectionServiceImpl implements IntersectionService{
    private final IntersectionRepository intersectionRepository;
    public IntersectionServiceImpl(IntersectionRepository intersectionRepository){
        this.intersectionRepository = intersectionRepository;
    }

    @Override
    public String intersection(
            JsonNode layerFeatures,
            JsonNode drawFeatures
    ){
        if(layerFeatures==null){
            throw new IllegalArgumentException(
                    "图层要素不能为空"
            );
        }
        if(drawFeatures==null){
            throw new IllegalArgumentException(
                    "绘制要素不能为空"
            );
        }
        return intersectionRepository.intersection(
                layerFeatures.toString(),
                drawFeatures.toString()
        );
    }

}
