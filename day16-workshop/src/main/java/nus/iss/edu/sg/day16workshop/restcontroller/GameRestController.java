package nus.iss.edu.sg.day16workshop.restcontroller;

import java.io.StringReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import nus.iss.edu.sg.day16workshop.model.Game;
import nus.iss.edu.sg.day16workshop.service.GameService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(path="/api/boardgame", produces=MediaType.APPLICATION_JSON_VALUE)
public class GameRestController {

    @Autowired
    GameService gameService;
    
    @PostMapping(consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> postGame(@RequestBody Game payload) throws ParseException { //using this method means that json cant parse any other form of date value other than the standard like 2024-03-15T05:15:07.013+00:00 or 2024-03-15
        // JsonReader jReader = Json.createReader(new StringReader(payload));
        // JsonObject jObject = jReader.readObject();
        // Game game = new Game();

        // SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
        // String dateString = jObject.get("gameDate").toString();
        // dateString = dateString.replace("\"", ""); //there is bug in postman
        // Date gdate = sdf.parse(dateString);
        // game.setGameDate(gdate);
        // game.setHomeTeam(jObject.get("homeTeam").toString());
        // game.setOppTeam(jObject.get("oppTeam").toString());
        // game.setVenue(jObject.get("venue").toString());
        // game.setGameId(jObject.get("gameId").toString());
        // System.out.println("Game saved: " + game.toString());
        
        //save it into REDIS
        //handle this via GameService which will interactiwith repo/REDIS
        gameService.createGame(payload);

        //construct responsePayload and return 
        //format - {“insert_count”: 1, “id”: <Redis key> }}
        JsonObject responsePayload = Json.createObjectBuilder()
                                        .add("insert_count", "1")
                                        .add("id", payload.getGameId())
                                        .build();

        return new ResponseEntity<String>(responsePayload.toString(), HttpStatus.CREATED);
    }

    @GetMapping(path="/getGames")
    public ResponseEntity<List<Game>> getAllGames() {
    
        return new ResponseEntity<List<Game>>(gameService.getAllGames(), HttpStatus.OK);
    }
    
    @GetMapping("/{game-id}")
    public ResponseEntity<Game> getGameById(@PathVariable("game-id") String gameId) {
        return new ResponseEntity<Game>(gameService.getGameById(gameId), HttpStatus.OK);
    }

    @PutMapping("")
    public ResponseEntity<Boolean> updateGame(@RequestBody Game payload) {
        gameService.updateGame(payload);
        
        return ResponseEntity.ok(true);
    }

    //need to check gameId first
    @DeleteMapping("/{game-id}")
    public ResponseEntity<Boolean> delGameById(@PathVariable("game-id") String gameId) {
        gameService.delGameById(gameId);
        
        return ResponseEntity.ok(true);
    }



}
