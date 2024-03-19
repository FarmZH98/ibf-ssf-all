package sg.edu.nus.iss.sffpracticetest;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.json.JSONArray;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.google.gson.Gson;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import sg.edu.nus.iss.sffpracticetest.model.Task;

@SpringBootApplication
public class SffPracticeTestApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(SffPracticeTestApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		//read data from todos.txt
		String filePath = "todos.txt";
		String jsonString;

		try {
			// Create a Gson instance
			Gson gson = new Gson();

			// Create a reader for the JSON file
            FileReader reader = new FileReader("todos.txt");

            // Convert JSON array to a list of User objects
            List<Task> taskList = gson.fromJson(reader, List.class);

            // Print user objects
            for (Task task : taskList) {
                System.out.println(task.getId() + " (" + task.getName() + ")");
            }

            // Close the reader
            reader.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }



}
