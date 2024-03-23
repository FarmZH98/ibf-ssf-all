package vttp2023.ssf.day19.day19.service;

import java.security.SecureRandom;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class LoginService {
    
    public List<Integer> generateCaptcha() {
        Random rand = new SecureRandom();
        Integer number1 = rand.nextInt(1, 11);
        Integer number2 = rand.nextInt(1, 11);
        Integer answer = number1 + number2;

        List<Integer> numbers = new LinkedList<>();
        numbers.add(number1);
        numbers.add(number2);
        numbers.add(answer);
        
        return numbers;
    }

}
