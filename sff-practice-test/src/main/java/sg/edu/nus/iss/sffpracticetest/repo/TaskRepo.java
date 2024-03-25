package sg.edu.nus.iss.sffpracticetest.repo;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import sg.edu.nus.iss.sffpracticetest.model.Task;
import sg.edu.nus.iss.sffpracticetest.utils.Utils;

@Repository
public class TaskRepo {
    
    @Autowired
    @Qualifier(Utils.REDIS_ONE)
    RedisTemplate<String, String> template;

    //utils.KEY_TASK, taskID, task
    HashOperations<String, String, String> hashOps;

    public void saveTask(Task task) {
        hashOps = template.opsForHash();
        hashOps.putIfAbsent(Utils.KEY_TASK, task.getId(), task.toJsonString());
    }

    public List<Task> getAllTasks() {
        hashOps = template.opsForHash();
        Map<String,String> rawMap = hashOps.entries(Utils.KEY_TASK);

        List<Task> tasksList = new LinkedList<>();

        for (var entry : rawMap.entrySet()) {
            Task task = Task.jsonToTask(entry.getValue());
            tasksList.add(task);
            System.out.println("getAllTasks() >>> " + task.toString());
        }

        return tasksList;
    }

}
