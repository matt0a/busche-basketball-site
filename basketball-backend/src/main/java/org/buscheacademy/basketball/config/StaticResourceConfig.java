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

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Paths.get(staffDir).toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/uploads/staff/**")
                .addResourceLocations(location);
    }
}
