package sg.edu.nus.iss.day19.model;

import jakarta.validation.constraints.NotEmpty;

public class Item {

    @NotEmpty(message = "Item cannot be empty")
    private String item;
    private Integer quantity;

    public Item(String item, Integer quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "Item [item=" + item + ", quantity=" + quantity + "]";
    }

    
    
}
