package sg.edu.nus.iss.day15.repo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import sg.edu.nus.iss.day15.utils.Util;

@Repository
public class PersonRepo {
    
    @Autowired
    @Qualifier(Util.REDIS_ONE)
    RedisTemplate<String, String> template;

    //create
    public Long addToList(String key, String value) {
        return template.opsForList().rightPush(key, value);
    }

    //read all
    public List<String> retrieveList(String key) {
        return template.opsForList().range(key, 0, -1);
    }

    //update
    public Boolean deleteItem(String key, String value) {
        Boolean isDeleted = false;

        ListOperations<String, String> listOps = template.opsForList();

        Long foundIndex = listOps.indexOf(key, value);

        if(foundIndex >= 0) {
            listOps.remove(key, 1, value);
            isDeleted = true;
        }

        return isDeleted;

    }
}
