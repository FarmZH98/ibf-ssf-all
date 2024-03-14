package sg.edu.nus.iss.day14.controller;

import java.io.FileNotFoundException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import sg.edu.nus.iss.day14.model.Employee;
import sg.edu.nus.iss.day14.repo.EmployeeRepo;

@Controller
@RequestMapping(path = "/employees") //we put the get/putMapping in methods and not class level
public class EmployeeController {
    
    //injection (*should supposedly do in service class)
    @Autowired
    EmployeeRepo empRepo;

    //http://localhost:<port no>/employees/add
    @GetMapping("/add")
    public String employeeAdd(Model model) {

        Employee employee = new Employee();

        model.addAttribute("employeeNew", employee);
        //have an employeeadd.html in resource/template folder
        return "employeeadd";
    }

    @PostMapping("/add")
    public String saveEmployee(@Valid @ModelAttribute("employeeNew") Employee employeeForm, BindingResult result, Model model) throws FileNotFoundException {
        if(result.hasErrors()) {
            return "employeeadd";
        }

        // perform some ops
        // i.e. save to a file/db
        // redirect to a success
        empRepo.save(employeeForm);


        model.addAttribute("savedEmployee", employeeForm);
        return "success";
    }

    @GetMapping("/list")
    public String listEmployeeList(Model model) {

        List<Employee> employees = empRepo.findAllEmployees();
        model.addAttribute("employees", employees);

        return "employeeList";
    }

    @GetMapping("/delete/{email}")
    public String deleteEmployee(@PathVariable("email") String email) {
        Employee employee = empRepo.findbyEmail(email);

        Boolean isDeleted = empRepo.deleteEmployee(employee);

        return "redirect:/employees/list"; //redirect here is important because we don't want to get the 'old' data accidentally. redirect forces the code to refresh and retrieve

    }
}
