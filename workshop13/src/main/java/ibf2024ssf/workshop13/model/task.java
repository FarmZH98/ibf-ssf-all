package ibf2024ssf.workshop13.model;

import java.util.Date;

public class task {
    private String taskName;
    private Integer priority;
    private Date dueDate;
    
    public task(String taskName, Integer priority, Date dueDate) {
        this.taskName = taskName;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    @Override
    public String toString() {
        return "task [taskName=" + taskName + ", priority=" + priority + ", dueDate=" + dueDate + "]";
    }

    
}
