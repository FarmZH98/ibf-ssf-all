package nus.iss.edu.sg.day16workshop.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import nus.iss.edu.sg.day16workshop.model.Game;
import nus.iss.edu.sg.day16workshop.repo.GameRepo;

@Controller
@RequestMapping("")
public class GameController {
    
    @Autowired
    GameRepo gameRepo;

    @GetMapping(path = {"/" ,"/boardgame/list"})
    public ModelAndView getGameList() {
        ModelAndView mav = new ModelAndView("list");

        Map<String, Game> gameMap = gameRepo.getAllGames();
        mav.addObject("gameMap", gameMap);
        
        return mav;

    }




}
