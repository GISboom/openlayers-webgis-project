package com.example.webgis_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class IntersectionRepository {

    private final JdbcTemplate jdbcTemplate;

    public IntersectionRepository(
            JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String intersection(
            String layerGeoJson,
            String drawGeoJson) {

        String sql = """
                SELECT ST_AsGeoJSON(
                    ST_Transform(
                        ST_Union(
                            ST_Intersection(
                                city.geom,
                                draw.geom
                            )
                        ),
                        4326
                    )
                )
                FROM
                (
                    SELECT
                        ST_Transform(
                            ST_SetSRID(
                                ST_GeomFromGeoJSON(
                                    feature -> 'geometry'
                                ),
                                4326
                            ),
                            3857
                        ) AS geom
                    FROM jsonb_array_elements(
                        ?::jsonb -> 'features'
                    ) AS feature
                ) AS city,
                (
                    SELECT
                        ST_Union(
                            ST_Transform(
                                ST_SetSRID(
                                    ST_GeomFromGeoJSON(
                                        feature -> 'geometry'
                                    ),
                                    4326
                                ),
                                3857
                            )
                        ) AS geom
                    FROM jsonb_array_elements(
                        ?::jsonb -> 'features'
                    ) AS feature
                ) AS draw
                WHERE ST_Intersects(
                    city.geom,
                    draw.geom
                )
                """;

        return jdbcTemplate.queryForObject(
                sql,
                String.class,
                layerGeoJson,
                drawGeoJson
        );
    }
}