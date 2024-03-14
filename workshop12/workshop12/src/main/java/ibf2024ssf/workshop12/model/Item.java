package ibf2024ssf.workshop12.model;

public class Item {
    private String itemName;
    private Integer quantity;
    
    public String getItemName() {
        return itemName;
    }
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return itemName + "|" + quantity;
    }

    
}
