package sg.edu.nus.iss.day19.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import sg.edu.nus.iss.day19.model.Order;
import sg.edu.nus.iss.day19.util.Util;

@Service
public class OrderService {
    
    private String generateOrderId() {
        return UUID.randomUUID().toString(); //.substring(0,8) to limit length
    }

    public Order generateOrder(String cartJson) {

        Order order = Util.parseCartJson(cartJson);
        order.setOrderId(generateOrderId());
        return order;
    }
}
