package nus.iss.edu.sg.day16workshop.repo;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import nus.iss.edu.sg.day16workshop.model.Game;
import nus.iss.edu.sg.day16workshop.utils.Util;

@Repository
public class GameRepo {
    @Autowired
    @Qualifier(Util.REDIS_TWO)
    RedisTemplate<String, Game> template;

    //util_keyGame, gameID, game
    HashOperations<String, String, Game> hashOps;

    // CREATE (in Redis Map)
    public void saveGame(Game game) {
        hashOps = template.opsForHash();
        hashOps.putIfAbsent(Util.KEY_GAME, game.getGameId(), game);
    }

    // READ (from Redis Map)
    public Map<String, Game> getAllGames() {
        hashOps = template.opsForHash();
        return hashOps.entries(Util.KEY_GAME);
    }

    // READ one specific record (from Redis Map)
    public Game getGameById(String gameId) {
        hashOps = template.opsForHash();
        //Map<String, Game> map = hashOps.entries(Util.KEY_GAME);

        //return map.get(gameId);
        return hashOps.get(Util.KEY_GAME, gameId);
    }

    // UPDATE a specific record (in Redis Map)
    public void updateGame(Game game) {
        hashOps = template.opsForHash();
        hashOps.put(Util.KEY_GAME, game.getGameId(), game);
    }

    // DELETE operations of a record (in Redis Map)
    public void deleteGame(String gameId) {
        hashOps = template.opsForHash();
        hashOps.delete(Util.KEY_GAME, gameId);
    }
}
