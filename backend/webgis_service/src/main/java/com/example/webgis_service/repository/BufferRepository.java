package com.example.webgis_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BufferRepository {
    private final JdbcTemplate jdbcTemplate;
    public BufferRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    public String buffer(String geoJson, Double distance) {
        String sql = """
                SELECT ST_AsGeoJSON(
                    ST_Transform(
                        ST_Union(
                            ST_Buffer(
                                ST_Transform(
                                    ST_SetSRID(
                                        ST_GeomFromGeoJSON(
                                            feature -> 'geometry'
                                        ),
                                        4326
                                    ),
                                    3857
                                ),
                                ?
                            )
                        ),
                        4326
                    )
                )
                FROM jsonb_array_elements(
                    ?::jsonb -> 'features'
                ) AS feature
                """;
        return jdbcTemplate.queryForObject(
                sql,
                String.class,
                distance,
                geoJson

        );
    }
}