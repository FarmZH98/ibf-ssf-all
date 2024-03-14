package ibf.day11.ssf.day11.controllers;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

//GET /time

@Controller
@RequestMapping(path="/time")
public class TimeController {
    
    @GetMapping(path={"/dayofweek", "/dow"})
    public String getDayOfWeek(Model model) {
        System.out.println(">>> GET /time/dow");
        DateFormat formatter = new SimpleDateFormat("EEEEE");
        Date date = new Date();
        String dayOfWeek = formatter.format(date);

        model.addAttribute("dow", dayOfWeek); //this is the attribute name for html to call it
        
        return "dayofweek"; //this refers to html file name
        
    }

    @GetMapping
    public String getTime(Model model) {
        System.out.println(">>> GET /time");
        String currTime = (new Date()).toString();

        //model.addAttribute("time", currTime);
        model.addAttribute("time", currTime);
        model.addAttribute("weather", "cloudy");

        return "time";
    }
}
