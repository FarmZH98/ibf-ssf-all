package sg.edu.nus.iss.day19.util;

import java.io.StringReader;
import java.util.List;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import sg.edu.nus.iss.day19.model.Item;
import sg.edu.nus.iss.day19.model.Order;

public class Util {
    
    public static Order parseCartJson(String payload) {

        JsonReader jReader = Json.createReader(new StringReader(payload));
        JsonObject jObject = jReader.readObject();

        Order order = new Order();
        order.setName(jObject.getString("name"));
        order.setEmail(jObject.getString("email"));
        order.setIsRush(jObject.getBoolean("rush", false)); //the parameter behind is added in case when we get the form, the value is not set
        order.setComments(jObject.getString("comments", ""));
        
        JsonArray jArray = jObject.getJsonArray("items");

        List<Item> cart = jArray.stream()
                            .map(v -> v.asJsonObject())
                            .map(v -> {
                                Item item = new Item(v.getString("item"), v.getInt("quantity"));
                                return item;
                            })
                            .toList();

        
        order.setCart(cart);

        return order;
    }
}
