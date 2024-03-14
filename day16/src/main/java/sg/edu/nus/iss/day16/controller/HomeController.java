package sg.edu.nus.iss.day16.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonObject;

@Controller
@RequestMapping("/home")
public class HomeController {
    
    @GetMapping("/test")
    @ResponseBody
    public ResponseEntity<String> getTestEmployee() {
        JsonObject jEmployee = Json.createObjectBuilder()
                                .add("firstName", "Taylor")
                                .add("lastName", "Swift")
                                .build();
 
        return ResponseEntity.status(HttpStatus.OK).body (jEmployee.toString());
    }

    @GetMapping("/time")
    @ResponseBody
    public String getTimeAsJson() throws ParseException {

        Date currentDate = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
        String currDate = sdf.format(currentDate);

        JsonObject obj = Json.createObjectBuilder()
                .add("time", currDate)
                .build();

        return obj.toString();
    }
}
