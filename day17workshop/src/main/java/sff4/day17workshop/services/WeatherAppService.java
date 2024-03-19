package sff4.day17workshop.services;

import java.io.StringReader;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonNumber;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import sff4.day17workshop.models.CityWeather;


//cache result for 30mins (REDIS)

@Service
public class WeatherAppService {
    public static final String SEARCH_URL = "https://api.openweathermap.org/data/2.5/weather";

    @Value("${weather.key}") //way to get env variable in application properties
    private String apiKey;

    public List<CityWeather> search(String city) {

        // Construct the URL to call
        String url = UriComponentsBuilder
                .fromUriString(SEARCH_URL)
                .queryParam("appid", apiKey)
                .queryParam("q", city) //can add another query param to get metric data instead of converting from our side
                .toUriString();

        System.out.printf("url >>> %s\n", url);

        // Make the GET request
        RequestEntity<Void> req = RequestEntity.get(url).accept(MediaType.APPLICATION_JSON).build();

        // Make the call
        RestTemplate template = new RestTemplate();
        
        ResponseEntity<String> resp = template.exchange(req, String.class);

        System.out.printf("Status codes: %d\n", resp.getStatusCode().value());
        // System.out.printf("Payload: %s\n", resp.getBody());

        List<CityWeather> weatherList = new LinkedList<>();
        // Process the body
        JsonReader reader = Json.createReader(new StringReader(resp.getBody()));
        JsonObject weatherResponse = reader.readObject();
        JsonArray data = weatherResponse.getJsonArray("weather");
        JsonObject mainData = weatherResponse.getJsonObject("main");

        Double tempDouble = mainData.getJsonNumber("temp").doubleValue();

        Double feels_likeDouble = mainData.getJsonNumber("feels_like").doubleValue();

        Double temp_minDouble = mainData.getJsonNumber("temp_min").doubleValue();

        Double temp_maxDouble = mainData.getJsonNumber("temp_max").doubleValue();

        Integer pressureInteger = mainData.getJsonNumber("pressure").intValue();

        Integer humidityInteger = mainData.getJsonNumber("humidity").intValue();

        // loop through data
        for (int i = 0; i < data.size(); i++) {
            // Convert the element to Json Object
            JsonObject elem = data.get(i).asJsonObject();
            String main = elem.getString("main");
            String description = elem.getString("description");
            String icon = elem.getString("icon"); // https://openweathermap.org/img/wn/10d@2x.png
            String iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            CityWeather cityWeather = new CityWeather(description, icon, main, tempDouble, feels_likeDouble, temp_minDouble, temp_maxDouble, pressureInteger, humidityInteger);
            System.out.println(cityWeather.toString());
            weatherList.add(cityWeather);

        }

        return weatherList;
    }
}
