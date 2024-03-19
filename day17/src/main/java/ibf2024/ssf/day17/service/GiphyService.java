package ibf2024.ssf.day17.service;

import java.io.StringReader;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import ibf2024.ssf.day17.models.GiphyImage;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

@Service
public class GiphyService {

    public static final String SEARCH_URL = "https://api.giphy.com/v1/gifs/search";

    @Value("${giphy.key}") //way to get env variable in application properties
    private String apiKey;

    public List<GiphyImage> search(String term) {
        // String url = UriComponentsBuilder
        //     .fromUriString(SEARCH_URL)
        //     .queryParam("apiKey", apiKey)
        //     .queryParam("limit", 10)
        //     .toUriString();


        // System.out.println(url);

        // RequestEntity<void>

        // JsonReader reader = Json.createReader(new StringReader(resp.getBody()));
        // Construct the URL to call
        String url = UriComponentsBuilder
                .fromUriString(SEARCH_URL)
                .queryParam("api_key", apiKey)
                .queryParam("q", term)
                .queryParam("limit", 5)
                .toUriString();

        System.out.printf("url >>> %s\n", url);

        // Make the GET request
        RequestEntity<Void> req = RequestEntity.get(url).build();

        // Make the call
        RestTemplate template = new RestTemplate();
        
        ResponseEntity<String> resp = template.exchange(req, String.class);

        System.out.printf("Status codes: %d\n", resp.getStatusCode().value());
        // System.out.printf("Payload: %s\n", resp.getBody());

        List<GiphyImage> images = new LinkedList<>();
        // Process the body
        JsonReader reader = Json.createReader(new StringReader(resp.getBody()));
        JsonObject giphyResponse = reader.readObject();
        JsonArray data = giphyResponse.getJsonArray("data");
        // loop through data
        for (int i = 0; i < data.size(); i++) {
            // Convert the element to Json Object
            JsonObject elem = data.get(i).asJsonObject();
            String title = elem.getString("title");
            JsonObject image = elem.getJsonObject("images");
            JsonObject fixedWidth = image.getJsonObject("fixed_width");
            String imgUrl = fixedWidth.getString("url");
            GiphyImage img = new GiphyImage(title, imgUrl);
            
            images.add(img);

        }

        return images;
    }
    
}
