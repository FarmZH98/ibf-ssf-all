package sg.edu.nus.iss.day15.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sg.edu.nus.iss.day15.model.Person;
import sg.edu.nus.iss.day15.repo.PersonRepo;

@Service
public class PersonService {

    @Autowired
    PersonRepo personRepo;
    
    public void addPerson(String key, Person person) {
        personRepo.addToList(key, person.toString());
    }


    public List<Person> getPersonList(String key) {

        List<String> rawList = personRepo.retrieveList(key);

        List<Person> persons = new ArrayList<>();


        for (String raw: rawList) {
            String[] info = raw.split(",");
            Person p = new Person(Integer.parseInt(info[0].trim()), info[1], Integer.parseInt(info[2].trim()) );
            persons.add(p);
        }

        return persons;
    }
    
}
