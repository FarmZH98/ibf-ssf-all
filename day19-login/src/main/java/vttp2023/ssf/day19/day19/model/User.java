package vttp2023.ssf.day19.day19.model;

public class User {
    
    private String username;
    private String password;
    private String passwordInput;
    private Integer attempts = 0;
    private boolean isSuspended = false;
    private Integer number1;
    private Integer number2;
    private Integer answer;

    public User() {}

    public String getPasswordInput() {
        return passwordInput;
    }

    public void setPasswordInput(String passwordInput) {
        this.passwordInput = passwordInput;
        // System.out.println("setPasswordInput");
        // System.out.println(this.password);
        // if (!this.passwordInput.equals(this.password)) {
        //     addAttempts();
        // }
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
        this.password = username+username;
        
    }


    public String getPassword() {
        return password;
    }

    public boolean isSuspended() {
        return isSuspended;
    }
    
    public void addAttempts() {
        System.out.println("addAttempts");
        this.attempts++;
        System.out.println(this.attempts);
        if(this.attempts > 1) this.isSuspended = true;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public Integer getNumber1() {
        return number1;
    }

    public void setNumber1(int number1) {
        this.number1 = number1;
    }

    public Integer getNumber2() {
        return number2;
    }

    public void setNumber2(int number2) {
        this.number2 = number2;
    }

    public Integer getAnswer() {
        return answer;
    }

    public void setAnswer(int answer) {
        this.answer = answer;
    }

    @Override
    public String toString() {
        return "User [username=" + username + ", password=" + password + ", passwordInput=" + passwordInput
                + ", attempts=" + attempts + ", isSuspended=" + isSuspended + ", number1=" + number1 + ", number2="
                + number2 + ", answer=" + answer + "]";
    }

    

    

}
