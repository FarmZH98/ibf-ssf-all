package nus.iss.edu.sg.day16workshop.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import jakarta.validation.Valid;
import nus.iss.edu.sg.day16workshop.model.Game;
import nus.iss.edu.sg.day16workshop.repo.GameRepo;

@Controller
@RequestMapping("")
public class GameController {
    
    @Autowired
    GameRepo gameRepo;

    @GetMapping(path = {"/boardgame/list"})
    public ModelAndView getGameList() {
        ModelAndView mav = new ModelAndView("list");

        Map<String, Game> gameMap = gameRepo.getAllGames();
        mav.addObject("gameMap", gameMap);
        
        return mav;

    }

    @GetMapping(path = {"/", "/index"})
    public ModelAndView addGame() {
        ModelAndView mav = new ModelAndView("index");

        Game newGame = new Game();
        mav.addObject("newGame", newGame);
        
        return mav;

    }

    @PostMapping(path = {"/boardgame/add"})
    public ModelAndView saveGame(@Valid @ModelAttribute("newGame") Game newGame, BindingResult result) {
        ModelAndView mav = new ModelAndView("index");
        if(result.hasErrors()) {
            return mav;
        }

        mav.setViewName("success");
        gameRepo.saveGame(newGame);
        mav.addObject("savedGame", newGame);
        
        return mav;

    }


}
