package sg.edu.nus.iss.day19.model;

import java.io.StringReader;
import java.util.LinkedList;
import java.util.List;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class Order {
    @NotEmpty(message = "name cannot be empty")
    @Size(min = 5, max = 20, message = "The size of name must be between 5-20chars")
    private String name;

    @Email(message = "please key in a valid email")
    @NotBlank(message = "Email cannot be empty or blank")
    private String email;
    private boolean isRush;
    private String comments;
    private List<Item> cart;
    private String orderId;
    
    public Order(String name, String email, boolean isRush, String comments, List<Item> cart) {
        this.name = name;
        this.email = email;
        this.isRush = isRush;
        this.comments = comments;
        this.cart = cart;
        //parseCartJson();
    }

    public Order() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean getIsRush() {
        return isRush;
    }

    public void setIsRush(boolean isRush) {
        this.isRush = isRush;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public List<Item> getCart() {
        return cart;
    }

    public void setCart(List<Item> cart) {
        this.cart = cart;
    }

    public void addItem(Item item) {
        this.cart.add(item);
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    @Override
    public String toString() {
        return "Order [name=" + name + ", email=" + email + ", isRush=" + isRush + ", comments=" + comments + ", cart="
                + cart + ", orderId=" + orderId + "]";
    }

    

}
