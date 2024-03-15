package nus.iss.edu.sg.day16workshop.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.iss.edu.sg.day16workshop.model.Game;
import nus.iss.edu.sg.day16workshop.repo.GameRepo;

@Service
public class GameService {

    @Autowired
    GameRepo gameRepo;

    // save data into REDIS
    public void createGame(Game game) {
        
        gameRepo.saveGame(game);
    }

    public List<Game> getAllGames() {
        List<Game> gameList = new ArrayList<>();
        Map<String, Game> gameMap = gameRepo.getAllGames();
        for (Game game : gameMap.values())  
            gameList.add(game);

        return gameList;
    }
    
    public Game getGameById(String gameId) {

        return gameRepo.getGameById(gameId);
    }

    public void updateGame(Game game) {

        gameRepo.updateGame(game);
    }

    public void delGameById(String gameId) {

        gameRepo.deleteGame(gameId);
    }

}
