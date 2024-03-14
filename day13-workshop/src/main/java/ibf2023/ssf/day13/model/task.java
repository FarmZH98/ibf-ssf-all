package ibf2023.ssf.day13.model;

import java.time.LocalDate;


import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class task {

    @NotEmpty(message = "Please enter the task")
    private String task;

    private Integer priority; //no need constraint because it is already controlled in html

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "please enter a date")
    @Future(message = "dueDate must be in the future")
    private LocalDate dueDate;
    
    public task(String taskName, Integer priority, LocalDate dueDate) {
        this.task = taskName;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    public String getTask() {
        return task;
    }

    
    public void setTask(String taskName) {
        this.task = taskName;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        //System.out.println();
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    @Override
    public String toString() {
        return "task [task=" + task + ", priority=" + priority + ", dueDate=" + dueDate + "]";
    }

    
}
