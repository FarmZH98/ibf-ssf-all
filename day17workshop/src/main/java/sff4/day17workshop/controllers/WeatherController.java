package sff4.day17workshop.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import sff4.day17workshop.models.CityWeather;
import sff4.day17workshop.services.WeatherAppService;

@Controller
@RequestMapping
public class WeatherController {
    
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
}
