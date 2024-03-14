package ibf2024ssf.workshop12;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import ibf2024ssf.workshop12.model.Item;

public class utils {
    
    public static String serializeToString(List<Item> cartList) {

        String toReturn = "";

        for(int i=0; i<cartList.size(); ++i) {
            if(i>0) toReturn += ",";
            toReturn += cartList.get(i).toString();
        }

        return toReturn; //format: item|quantity,item|quantity
    }

    public static List<Item> deserializefromString (String cartString) {

        if(cartString.equals("")) {
            return new LinkedList<>();
        }

        List<Item> itemsListToReturn = new LinkedList<>();
        List<String> itemListString = Arrays.asList(cartString.split(","));
        for(String itemString: itemListString) {
            String[] item = itemString.split("\\|");
            System.out.println(item[0] + " " + item[1]);
            Item newItem = new Item();
            newItem.setItemName(item[0]);
            newItem.setQuantity(Integer.parseInt(item[1]));
            itemsListToReturn.add(newItem);
        }

        return itemsListToReturn;
    }
}
