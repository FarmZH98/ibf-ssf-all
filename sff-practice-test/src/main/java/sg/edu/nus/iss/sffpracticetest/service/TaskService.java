package sg.edu.nus.iss.sffpracticetest.service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.validation.Valid;
import sg.edu.nus.iss.sffpracticetest.model.Task;
import sg.edu.nus.iss.sffpracticetest.repo.TaskRepo;
import sg.edu.nus.iss.sffpracticetest.utils.Utils;

@Service
public class TaskService {

    @Autowired
    TaskRepo taskRepo;
    
    public List<Task> readTaskFromFile() throws ParseException {
		String jsonString = "";
        List<Task> taskList = new LinkedList<>();
        try {
            BufferedReader br = new BufferedReader(new FileReader(Utils.FILE_PATH));
            String temp = br.readLine();
            jsonString += temp;

            while(temp != null) {
                temp = br.readLine();
                jsonString += temp;
            }
            br.close();
            
            JsonReader reader = Json.createReader(new StringReader(jsonString));
            JsonArray dataArray = reader.readArray();
            for(int i=0; i<dataArray.size(); ++i) {
                JsonObject data = dataArray.get(i).asJsonObject();
                String id = data.getString("id");
                String name = data.getString("name");
                String description = data.getString("description");
                SimpleDateFormat formatter = new SimpleDateFormat("EEE, MM/dd/yyyy", Locale.ENGLISH);
                Date due_date = formatter.parse(data.getString("due_date"));
                String priority_lvel = data.getString("priority_level");
                String status = data.getString("status");
                Date created_at = formatter.parse(data.getString("created_at"));
                Date updated_at = formatter.parse(data.getString("updated_at"));
                Task task = new Task(id, name, description, due_date, priority_lvel, status, created_at, updated_at);
                taskRepo.saveTask(task);
                //System.out.println(task.toString());
                taskList.add(task);
            }
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        taskRepo.getAllTasks();
        return taskList;
    }

    public List<Task> getSpecificTasks(String status) throws ParseException {

        List<Task> allTasks = readTaskFromFile();
        List<Task> dummy = allTasks.stream()
                        .filter(task -> status.equals(task.getStatus()))
                        .toList();
        // List<Task> specificTaskList = new LinkedList<>();
        // for(int i=0; i<allTasks.size(); ++i) {
        //     if(allTasks.get(i).getStatus().equals(status)) {
        //         specificTaskList.add(allTasks.get(i));
        //     }
        // }
        

        return dummy;
    }

    public void saveTask(Task task) {
        task.setId(UUID.randomUUID().toString());
        task.setCreated_at(new Date());
        task.setUpdated_at(new Date());
        taskRepo.saveTask(task);
    }

    public List<Task> getAllTasks() {
        return taskRepo.getAllTasks();
    }

    public void deleteTask(String id) {
        taskRepo.deleteTask(id);
    }

    public Task getTaskById(String id) {
        String taskJson = taskRepo.getTaskById(id);

        return Task.jsonToTask(taskJson);
    }
    // public List<Task> getAllTasks() {

    public void editTask(@Valid Task task) {
        task.setUpdated_at(new Date());
        System.out.println(task.toString());
        taskRepo.editTask(task);
    }

    //     return taskRepo.getAllTasks();
    // }
}
