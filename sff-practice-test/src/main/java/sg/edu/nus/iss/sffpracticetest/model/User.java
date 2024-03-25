package sg.edu.nus.iss.sffpracticetest.model;

import java.util.List;

public class User {
    private String name;
    private Integer age;
    private List<Task> tasksList;

    public User () {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public List<Task> getTasksList() {
        return tasksList;
    }

    public void setTasksList(List<Task> tasksList) {
        this.tasksList = tasksList;
    }

    
}
