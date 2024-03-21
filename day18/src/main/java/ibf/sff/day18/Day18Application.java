package ibf.sff.day18;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import ibf.sff.day18.models.User;
import ibf.sff.day18.services.HttpbinService;

@SpringBootApplication
public class Day18Application implements CommandLineRunner {

	@Autowired
	private HttpbinService httpbinService;

	public static void main(String[] args) {
		SpringApplication.run(Day18Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		httpbinService.postByUrlEncodedForm(new User("barney", "barney@gmail.com"));
		httpbinService.postByJson(new User("barney", "barney@gmail.com"));
	}

}
