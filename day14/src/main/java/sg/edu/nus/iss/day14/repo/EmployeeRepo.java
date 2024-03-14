package sg.edu.nus.iss.day14.repo;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import sg.edu.nus.iss.day14.model.Employee;

@Repository
public class EmployeeRepo {
    
    //Windows: c://data
    final String dirPath = "c:\\data";

    final String fileName = "employee.txt";

    private List<Employee> employees;

    public EmployeeRepo() throws ParseException {
        if (employees == null) {
            employees = new ArrayList<>();
        }

        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Date birthday = df.parse("1998-06-03");
        Employee emp = new Employee("Walter", "White", birthday, 22000, "WalterWhite@email.com", "92345678", 123456);
        employees.add(emp);

        birthday = df.parse("1999-01-01");
        emp = new Employee("Walter", "Night", birthday, 2000, "WalterNight@email.com", "82345678", 654321);
        employees.add(emp);
    }

    public List<Employee> findAllEmployees() {
        return employees;
    }

    public Boolean save (Employee employee) throws FileNotFoundException {
        Boolean isSaved = false;

        // add the new employee record to the List<Employee> object
        employees.add(employee);

        File file = new File(dirPath + "/" + fileName);
        OutputStream os = new FileOutputStream(file, true);
        PrintWriter pw = new PrintWriter(os);
        pw.println(employee.toString());
        pw.flush();
        pw.close();

        return isSaved;
        
    }

    public Employee findbyEmail(String email) {
        
        return employees.stream().filter(emp -> emp.getEmail().equals(email)).findFirst().get();
    }

    public Boolean deleteEmployee (Employee employee) {

        Boolean isDeleted = false;
        int indexValue = employees.indexOf(employee);

        if(indexValue < 0) {
            return false; //not found
        }

        employees.remove(indexValue);
        isDeleted = true;


        return isDeleted;
    }
    
}
