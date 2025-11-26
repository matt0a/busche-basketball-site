package org.buscheacademy.basketball.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${app.upload.staff-dir:uploads/staff}")
    private String staffDir;

    @Value("${app.upload.player-dir:uploads/players}")
    private String playerDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String staffLocation = Paths.get(staffDir).toAbsolutePath().toUri().toString();
        String playerLocation = Paths.get(playerDir).toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/uploads/staff/**")
                .addResourceLocations(staffLocation);

        registry.addResourceHandler("/uploads/players/**")
                .addResourceLocations(playerLocation);
    }
}
