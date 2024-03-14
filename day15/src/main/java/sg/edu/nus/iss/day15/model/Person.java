package sg.edu.nus.iss.day15.model;

public class Person {
    
    private Integer id;
    private String fullName;
    private Integer salary;

    public Person() {
    }

    public Person(int id, String fullName, int salary) {
        this.id = id;
        this.fullName = fullName;
        this.salary = salary;
    }
    public Integer getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public Integer getSalary() {
        return salary;
    }
    public void setSalary(int salary) {
        this.salary = salary;
    }

    @Override
    public String toString() {
        return  id + "," + fullName + "," + salary;
    }

    
}
