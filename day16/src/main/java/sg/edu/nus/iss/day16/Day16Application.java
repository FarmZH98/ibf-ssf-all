package sg.edu.nus.iss.day16;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonValue;
import sg.edu.nus.iss.day16.model.Address;
import sg.edu.nus.iss.day16.model.Employee;
import sg.edu.nus.iss.day16.model.Phone;

@SpringBootApplication
public class Day16Application implements CommandLineRunner { 

	public static void main(String[] args) {
		SpringApplication.run(Day16Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		
		// slide 7
		JsonObjectBuilder empBuilder = Json.createObjectBuilder();
		empBuilder.add("firstName","Will")
						.add("lastName","Smith")
						.add("salary", 20000);

		JsonObjectBuilder addressBuilder = Json.createObjectBuilder();
		addressBuilder.add("line1", "Potong Pasir View")
					.add("line2", "8 Potong Pasir Ave 1")
					.add("postal", "358008");
		
		empBuilder.add("address", addressBuilder);

		JsonObjectBuilder phone1 = Json.createObjectBuilder();
		phone1.add("type", "default")
			.add("number", "97304666");

		JsonObjectBuilder phone2 = Json.createObjectBuilder();
		phone2.add("type", "mobile")
			.add("number", "98765432");

		JsonArrayBuilder arrBuilder = Json.createArrayBuilder();
		arrBuilder.add(phone1)
				.add(phone2);
		empBuilder.add("phones", arrBuilder);

		JsonObject employeeObject = empBuilder.build();

		//map back jsonObject to employee
		Employee emp = new Employee();
		emp.setFirstName(employeeObject.get("firstName").toString());
		emp.setLastName(employeeObject.get("lastName").toString());
		emp.setSalary(Long.parseLong(employeeObject.get("salary").toString()));

		JsonObject addressObject = employeeObject.getJsonObject("address");
		Address address = new Address();
		address.setLine1(addressObject.get("line1").toString());
		address.setLine2(addressObject.get("line2").toString());
		address.setPostal(addressObject.get("postal").toString());
		emp.setAddress(address);

		JsonArray phonesArray = employeeObject.getJsonArray("phones");
		List<Phone> phoneList = new ArrayList<>();
		for(int i = 0; i < phonesArray.size(); i++) {
			JsonObject obj = phonesArray.getJsonObject(i);
			Phone phone = new Phone(obj.getString("type"), obj.getString("number"));
			phoneList.add(phone);
		}
		emp.setPhones(phoneList);


		System.out.println("Employee Entity: " + emp.toString());

	
	}

	

}
