package sg.edu.nus.iss.day15;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import sg.edu.nus.iss.day15.model.Person;
import sg.edu.nus.iss.day15.repo.PersonRepo;
import sg.edu.nus.iss.day15.repo.TestRepo;
import sg.edu.nus.iss.day15.service.PersonService;
import sg.edu.nus.iss.day15.utils.Util;

@SpringBootApplication
public class Day15Application implements CommandLineRunner {

	@Autowired
	TestRepo testRepo;

	@Autowired
	PersonRepo personRepo;

	@Autowired 
	PersonService personService;

	public static void main(String[] args) {
		SpringApplication.run(Day15Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		// testRepo.storeValueData("count", String.valueOf(1000));

		// String countValue = testRepo.retrieveValueData("count");
		// System.out.println("Count from Redis: " + countValue);

		// testRepo.storeValueData("email", "zhenghaofarm@gmail.com");
		// String email = testRepo.retrieveValueData("email");
		// System.out.println("Email from Redis: " + email);

		// testRepo.addToList("cart", "orange");
		// testRepo.addToList("cart", "apple");
		// testRepo.addToList("cart", "pear]");
		// List<String> fruits = testRepo.getList("cart");
		
		// fruits.forEach(System.out::println);

		Person p = new Person(1, "Darryl", 20000);
		personService.addPerson(Util.KEY_PERSON, p);
		p = new Person(2, "Farm", 22000);
		personService.addPerson(Util.KEY_PERSON, p);
		p = new Person(3, "Fel", 24000);
		personService.addPerson(Util.KEY_PERSON, p);

		List<Person> personList = personService.getPersonList(Util.KEY_PERSON);

		for(Person person : personList) {
			System.out.println("id: " + person.getId() + ", fullName: " + person.getFullName() + ", salary: " + person.getSalary());
		}

		//try delete and update
	}
}
