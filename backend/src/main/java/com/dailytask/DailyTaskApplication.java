package com.dailytask;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.dailytask.mapper")
public class DailyTaskApplication {
    public static void main(String[] args) {
        SpringApplication.run(DailyTaskApplication.class, args);
    }
}
