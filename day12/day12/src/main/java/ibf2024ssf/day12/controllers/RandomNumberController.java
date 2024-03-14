package ibf2024ssf.day12.controllers;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(path="/rnd") //this is sort of optional and not needed. 
public class RandomNumberController {
    
    //GET /rnd/list
    @GetMapping(path="/list")
    public ModelAndView getRandomList(
        @RequestParam(defaultValue = "1") int startNum,
        @RequestParam(defaultValue = "100") int endNum,
        @RequestParam(required = true ) int count) {
            Random rand = new SecureRandom();
            List<Integer> numList = new LinkedList<>();
            for(int i=0; i<count; ++i) {
                int num = rand.nextInt(startNum, startNum+1);
                numList.add(num);
            }
            ModelAndView mav = new ModelAndView();
            mav.setViewName("numlist");
            mav.addObject("numList", numList);
            mav.setStatus(HttpStatusCode.valueOf(200));

            return mav;
    }

    //GET  /rnd/
    @GetMapping(produces = MediaType.TEXT_HTML_VALUE) //The produces part is redundant too, we dont need to put it cos controller knows what to produce, but just putting it here so we know how does the controller work BTS
    public String getRandom(Model model) {
        Random rand = new SecureRandom();
        int num = rand.nextInt(1, 11);

        boolean isOdd = (num%2) > 0;
        model.addAttribute("rndNum", num);
        model.addAttribute("odd", isOdd);

        return "numbers"; // templates/numbers.html
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE) //this is for request type of json
    @ResponseBody
    public ResponseEntity<String> dummyMethod() {
        return ResponseEntity.ok("{\"rnd\": 45}");
    }

}
