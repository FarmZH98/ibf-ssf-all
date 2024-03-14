package ibf2024ssf.workshop12.controllers;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import ibf2024ssf.workshop12.utils;
import ibf2024ssf.workshop12.model.Item;

@Controller
@RequestMapping(path="/cart")
public class ShoppingCartController {
    
    //GET /cart
    @GetMapping()
    public ModelAndView addItemAndReturnList (
        @RequestParam(required = true) String cartItem,
		@RequestParam(required = true) Integer quantity,
        @RequestParam (defaultValue = "") String existingCart) {

        System.out.println(existingCart);
        System.out.println(cartItem);
        System.out.println(quantity);

        //serialize existingCart into list
        List<Item> cartList = utils.deserializefromString(existingCart);



        //add item into list
        Item item = new Item();
        item.setItemName(cartItem);
        item.setQuantity(quantity);
        cartList.add(item);

        //deserialize it and add object into mav
        String cartString = utils.serializeToString(cartList);

        System.out.println(cartString);

        ModelAndView mav = new ModelAndView();
        mav.setViewName("cart");
        mav.addObject("cartString", cartString);
        mav.addObject("cartList", cartList);
        mav.setStatus(HttpStatusCode.valueOf(200));

        return mav;
    }


}

//2 problems: 
//1. how can I get from index and return to index.html => put index.html into templates, or just create 2 different ones, 1 static index.html, and 1 cart.html in template
//2. how do I display the data in html => data-th-value

