package sff4.day17workshop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import sff4.day17workshop.services.WeatherAppService;

@SpringBootApplication
public class Day17workshopApplication implements CommandLineRunner {

	@Autowired
	WeatherAppService weatherAppService;
	public static void main(String[] args) {
		SpringApplication.run(Day17workshopApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		//run service here to check
		weatherAppService.search("Singapore");
	}

}
