package org.buscheacademy.basketball.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                buildCache("teams", Duration.ofHours(24), 200),
                buildCache("playersByTeam", Duration.ofHours(12), 500),
                buildCache("scheduleFull", Duration.ofMinutes(10), 10),
                buildCache("scheduleUpcoming", Duration.ofMinutes(5), 20),
                buildCache("scheduleRecent", Duration.ofMinutes(5), 20),
                buildCache("publicStaff", Duration.ofHours(12), 50),
                buildCache("publicStaffMember", Duration.ofHours(12), 200)
        ));
        return manager;
    }

    private CaffeineCache buildCache(String name, Duration ttl, long maxSize) {
        return new CaffeineCache(name,
                Caffeine.newBuilder()
                        .expireAfterWrite(ttl)
                        .maximumSize(maxSize)
                        .build());
    }
}
