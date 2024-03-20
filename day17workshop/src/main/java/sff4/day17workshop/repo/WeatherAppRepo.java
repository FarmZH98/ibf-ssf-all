package sff4.day17workshop.repo;

import java.io.StringReader;
import java.time.Duration;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import sff4.day17workshop.models.CityWeather;
import sff4.day17workshop.utils.Util;

@Repository
public class WeatherAppRepo {
    
    @Autowired
    @Qualifier(Util.REDIS_ONE)
    RedisTemplate<String, String> template;

    //HashOperations<String,String> hashOps;

    // public CityWeather getWeather(String city) {

    //     ValueOperations<String, String> ops = template.opsForValue();
    //     String weatherJson = ops.get(normalizeCity(city));

    //     JsonReader reader = Json.createReader(new StringReader(weatherJson));
    //     JsonObject j = reader.readObject();
    //     CityWeather weather = new CityWeather(j.getString("description"), j.getString("icon"), j.getString("main"), j.getJsonNumber("temp").doubleValue(), j.getJsonNumber("feels_like").doubleValue(), j.getJsonNumber("temp_min").doubleValue(), j.getJsonNumber("temp_max").doubleValue(), j.getJsonNumber("pressure").intValue(), j.getJsonNumber("humidity").intValue());

    //     return weather;
    // }

    public Optional<List<CityWeather>> getWeather(String city) {

        ValueOperations<String, String> ops = template.opsForValue();
        String weatherJson = ops.get(normalizeCity(city));
        
        if(null == weatherJson) {
            return Optional.empty();
        }

        JsonReader reader = Json.createReader(new StringReader(weatherJson));
        JsonArray jArray = reader.readArray();
        List<CityWeather> weatherList = new LinkedList<>();
        for(int i=0; i<jArray.size(); ++i) {
            JsonObject j = jArray.get(i).asJsonObject();
            CityWeather weather = new CityWeather(j.getString("description"), j.getString("icon"), j.getString("main"), Double.parseDouble(j.getString("temp")), Double.parseDouble(j.getString("feels_like")), Double.parseDouble(j.getString("temp_min")), Double.parseDouble(j.getString("temp_max")), j.getJsonNumber("pressure").intValue(), j.getJsonNumber("humidity").intValue());
            weatherList.add(weather);
        }

        return Optional.of(weatherList);
    }

    public Boolean saveWeather(CityWeather weather, String city) {

        //convert weather to json
        String _weather = convertToJson(weather).toString();

        //save city as key, weather json as value and set timeout to 30mins
        String _city = normalizeCity(city);

        ValueOperations<String, String> ops = template.opsForValue();
        ops.set(_city, _weather, Duration.ofMinutes(30));
        //template.expire(_city,30,TimeUnit.MINUTES); //alternative way to set expire on key

        return true;
    }

    public Boolean saveWeather(List<CityWeather> weatherList, String city) {

        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        for(CityWeather w : weatherList) {
            arrayBuilder.add(convertToJson(w));
        }

        //save city as key, weather json as value and set timeout to 30mins
        String _city = normalizeCity(city);

        ValueOperations<String, String> ops = template.opsForValue();
        ops.set(_city, arrayBuilder.build().toString(), Duration.ofMinutes(30));
        //template.expire(_city,30,TimeUnit.MINUTES); //alternative way to set expire on key

        return true;
    }

    private String normalizeCity(String city) {
        return city.toLowerCase().replaceAll("\\s+", "");
    }

    private JsonObject convertToJson(CityWeather weather) {
        return Json.createObjectBuilder()
            .add("description", weather.getDescription())
            .add("icon", weather.getIcon())
            .add("main", weather.getMain())
            .add("temp", weather.getTemp())
            .add("feels_like", weather.getFeels_like())
            .add("temp_min", weather.getTemp_min())
            .add("temp_max", weather.getTemp_max())
            .add("pressure", weather.getPressure())
            .add("humidity", weather.getHumidity())
            .build();
    }
}
