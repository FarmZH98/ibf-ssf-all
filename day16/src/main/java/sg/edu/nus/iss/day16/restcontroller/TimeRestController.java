package sg.edu.nus.iss.day16.restcontroller;

import java.io.StringReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(path="/api/time", produces=MediaType.APPLICATION_JSON_VALUE)
public class TimeRestController {
    
    @GetMapping("")
    public ResponseEntity<String> getTimeasJson() throws ParseException {

        SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
        JsonObject obj = Json.createObjectBuilder()
                            .add("time", sdf.format((new Date())))
                            .build();

        return ResponseEntity.ok(obj.toString());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> postTimeAsJsonString(@RequestBody String payload) {
        JsonReader jReader = Json.createReader(new StringReader(payload));
        JsonObject jObject = jReader.readObject();
        System.out.println("jObject payload: " + jObject.toString());

        JsonObject responsePayload = Json.createObjectBuilder()
                                        .add("time", jObject.get("time").toString())
                                        .add("status", "unchanged")
                                        .add("updatedBy", "me")
                                        .build();
        
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("Farm", (new Date().toString()));

        return new ResponseEntity<String>(responsePayload.toString(), HttpStatus.OK);
    }
    
}
