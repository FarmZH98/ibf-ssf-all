package sg.edu.nus.iss.sffpracticetest;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import sg.edu.nus.iss.sffpracticetest.service.TaskService;

@SpringBootApplication
public class SffPracticeTestApplication implements CommandLineRunner {

    @Autowired
    TaskService taskService;

	public static void main(String[] args) {
		SpringApplication.run(SffPracticeTestApplication.class, args);
	}

	@Override
	public void run(String... args) throws ParseException {
		taskService.readTaskFromFile();
		//read data from todos.txt
        //List<Task> taskList = taskService.readTaskFromFile();

		//testing below!
		// SimpleDateFormat formatter = new SimpleDateFormat("EEE, MM/dd/yyyy", Locale.ENGLISH);
		// Date date = formatter.parse("Sun, 10/15/2023");
		// Utils.dateToEpoch(date);
    }



}
