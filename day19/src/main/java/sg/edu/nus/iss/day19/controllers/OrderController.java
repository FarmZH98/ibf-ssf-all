package sg.edu.nus.iss.day19.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.validation.Valid;
import sg.edu.nus.iss.day19.model.Order;
import sg.edu.nus.iss.day19.services.OrderService;
import sg.edu.nus.iss.day19.util.Util;

@Controller
@RequestMapping
public class OrderController {
    
    @Autowired
    OrderService orderService;

    @PostMapping(path="/api/order", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> submitOrder(@RequestBody String payload) {
        System.out.println(payload);
        Order order = orderService.generateOrder(payload);

        //order.setOrderId(orderService.generateOrderId());
        System.out.println(order.toString());

        JsonObject responsePayload = Json.createObjectBuilder()
                                        .add("orderId", order.getOrderId())
                                        .build();

        return new ResponseEntity<String>(responsePayload.toString(), HttpStatus.CREATED);
    }
}
