package sg.edu.nus.iss.sffpracticetest.model;

import java.io.Serializable;
import java.io.StringReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import sg.edu.nus.iss.sffpracticetest.utils.Utils;

public class Task implements Serializable {

    @NotEmpty(message = "ID cannot be empty")
    @Size(max = 50, message = "max of 50 characters")
    private String id;

    @Size(min = 10 ,max = 50, message = "Task name should be between 10-50 characters")
    private String name;

    @Size(max = 255, message = "max of 255 characters")
    private String description;

    //@DateTimeFormat(pattern = "EEE, MM/dd/yyyy")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @FutureOrPresent(message = "due date should be a present or future date.")
    private Date due_date; //to store this as epoch in redis. so might need to chg heres

    @Pattern(regexp="^(Low|Medium|High)$",message="invalid priority. It should be Low|Medium|High")
    private String priority_level;

    @Pattern(regexp="^(Pending|Started|Progress|Completed)$",message="invalid status. It should be Pending|Started|Progress|Completed")
    private String status;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date created_at; //to store this as epoch in redis. so might need to chg here

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date updated_at; //to store this as epoch in redis. so might need to chg here

    public Task() {
    }

    

    public Task(String id, String name, String description, Date due_date, String priority_level, String status, Date created_at, Date updated_at) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.due_date = due_date;
        this.priority_level = priority_level;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }



    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Date getDue_date() {
        return due_date;
    }
    // public void setDue_date(String due_date) throws ParseException {
    //     SimpleDateFormat formatter = new SimpleDateFormat("EEE, MM/dd/yyyy", Locale.ENGLISH);
    //     Date date = formatter.parse(due_date);
    //     this.due_date = date;
    // }
    public void setDue_date(Date due_date) {
        this.due_date = due_date;
    }
    public String getPriority_level() {
        return priority_level;
    }
    public void setPriority_level(String priority_level) {
        this.priority_level = priority_level;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Date getCreated_at() {
        return created_at;
    }
    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }
    public Date getUpdated_at() {
        return updated_at;
    }
    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }

    @Override
    public String toString() {
        return "Task [id=" + id + ", name=" + name + ", description=" + description + ", due_date=" + due_date
                + ", priority_level=" + priority_level + ", status=" + status + ", created_at=" + created_at
                + ", updated_at=" + updated_at + "]";
    }

    //save time as epoch
    public String toJsonString() {

        JsonObject taskAsJson = Json.createObjectBuilder()
                        .add("id", id)
                        .add("name", name)
                        .add("description", description)
                        .add("due_date", Utils.dateToEpoch(due_date))
                        .add("priority_level", priority_level)
                        .add("status", status)
                        .add("created_at", Utils.dateToEpoch(created_at))
                        .add("updated_at", Utils.dateToEpoch(updated_at))
                        .build();

        return taskAsJson.toString();
    }
    
    public static Task jsonToTask(String taskJson) {

        JsonReader reader = Json.createReader(new StringReader(taskJson));
        JsonObject jObject = reader.readObject();
        Task taskToReturn = new Task();
        taskToReturn.setId(jObject.getString("id"));
        taskToReturn.setName(jObject.getString("name"));
        taskToReturn.setDescription(jObject.getString("description"));
        taskToReturn.setPriority_level(jObject.getString("priority_level"));
        taskToReturn.setStatus(jObject.getString("status"));
        taskToReturn.setDue_date(Utils.epochToDate
                                (Long.parseLong
                                (jObject.getJsonNumber("due_date").
                                toString())));
        taskToReturn.setCreated_at(Utils.epochToDate
                                (Long.parseLong
                                (jObject.getJsonNumber("created_at").
                                toString())));
        taskToReturn.setUpdated_at(Utils.epochToDate
                                (Long.parseLong
                                (jObject.getJsonNumber("updated_at").
                                toString())));

        //System.out.println("taskToReturn: " + taskToReturn.toString());

        return taskToReturn;
    }
}
