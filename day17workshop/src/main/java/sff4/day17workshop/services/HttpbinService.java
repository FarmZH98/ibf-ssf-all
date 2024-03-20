package sff4.day17workshop.services;

import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class HttpbinService {
    
    //check network access
    public boolean isAlive() {


        RequestEntity<Void> req = RequestEntity
            .get("https://httpbin.org/get")
            .build();


        try {
            RestTemplate template = new RestTemplate();
            template.exchange(req, String.class);
        } catch (Exception ex) {
            return false;        
        }


        return true;
    }
}
