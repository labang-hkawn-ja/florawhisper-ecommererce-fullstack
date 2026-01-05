package org.example.florawhisperbackend;

import lombok.RequiredArgsConstructor;
import org.example.florawhisperbackend.dao.CategoryDao;
import org.example.florawhisperbackend.dao.FlowerDao;
import org.example.florawhisperbackend.entity.Category;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
@RequiredArgsConstructor
public class FloraWhisperBackendApplication {
    private final CategoryDao categoryDao;
    private final FlowerDao flowerDao;

    @Bean @Profile("dev")
    public ApplicationRunner runner() {
        return r -> {
            Category category1 = new Category("Blooms");
            Category category2 = new Category("Greenery");

            categoryDao.save(category1);
            categoryDao.save(category2);
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(FloraWhisperBackendApplication.class, args);
    }

}
