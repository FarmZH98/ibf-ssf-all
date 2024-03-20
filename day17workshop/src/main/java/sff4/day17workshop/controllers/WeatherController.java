package sff4.day17workshop.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import sff4.day17workshop.models.CityWeather;
import sff4.day17workshop.services.HttpbinService;
import sff4.day17workshop.services.WeatherAppService;

@Controller
@RequestMapping
public class WeatherController {
    
    @Autowired
    HttpbinService httpbinService;

    @Autowired
    WeatherAppService weatherAppService;

    @GetMapping(path="/weather")
    public ModelAndView getGameList(@RequestParam String city) {

        ModelAndView mav = new ModelAndView("success");
        List<CityWeather> cityWeatherInfo = weatherAppService.search(city);
        mav.addObject("cityWeatherInfo", cityWeatherInfo);
        mav.addObject("city", city);
        mav.setStatus(HttpStatusCode.valueOf(200));


        return mav;
    }

    @GetMapping(path="/healthz")
    public ResponseEntity<String> getHealthz() {
        //return an empty json
        JsonObject j = Json.createObjectBuilder()
                        .build();
        if(httpbinService.isAlive()) {
            return ResponseEntity.ok(j.toString());
        }

        return ResponseEntity.status(400).body(j.toString());
    }
}
