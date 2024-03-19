package ibf2024.ssf.day17;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import ibf2024.ssf.day17.service.GiphyService;

@SpringBootApplication
public class Day17Application implements CommandLineRunner {


	@Autowired
	private GiphyService giphyService;

	public static void main(String[] args) {
		SpringApplication.run(Day17Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// giphyService.search("polar bear");
		// System.exit(0);
	}

}
