package sg.edu.nus.iss.sffpracticetest.model;

import java.io.Serializable;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class Task implements Serializable {

    @NotEmpty(message = "ID cannot be empty")
    @Size(max = 50, message = "max of 50 characters")
    private String id;

    @Size(min = 10 ,max = 50, message = "Task name should be between 10-50 characters")
    private String name;

    @Size(max = 255, message = "max of 255 characters")
    private String description;

    @DateTimeFormat(pattern = "EEE, MM/dd/yyyy")
    @FutureOrPresent(message = "due date should be a present or future date.")
    private Date due_date; //to store this as epoch in redis. so might need to chg heres

    @Pattern(regexp="^(Low|Medium|High)$",message="invalid priority. It should be Low|Medium|High")
    private String priority_level;

    @Pattern(regexp="^(Pending|Starting|Progress|Completed)$",message="invalid status. It should be Pending|Starting|Progress|Completed")
    private String status;
    private Date created_at; //to store this as epoch in redis. so might need to chg here
    private Date updated_at; //to store this as epoch in redis. so might need to chg here

    public Task() {
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

    
}
