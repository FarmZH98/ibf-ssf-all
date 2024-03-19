package sff4.day17workshop.models;

public class CityWeather {
    private String description;
    private String icon;
    private String main;
    private double temp;
    private double feels_like;
    private double temp_min;
    private double temp_max;
    private Integer pressure;
    private Integer humidity;
    private final double KELVIN_DIFF = 273.15;

    public CityWeather(String description, String icon, String main) {
        this.description = description;
        this.icon = icon;
        this.main = main;
    }

    

    public CityWeather(String description, String icon, String main, double temp, double feels_like, double temp_min,
    double temp_max, Integer pressure, Integer humidity) {
        this.description = description;
        this.icon = icon;
        this.main = main;
        this.temp = temp;
        this.feels_like = feels_like;
        this.temp_min = temp_min;
        this.temp_max = temp_max;
        this.pressure = pressure;
        this.humidity = humidity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getMain() {
        return main;
    }

    public void setMain(String main) {
        this.main = main;
    }

    public String getTemp() {
        return String.format("%.02f", temp - KELVIN_DIFF);
        //return temp - KELVIN_DIFF;
    }

    public void setTemp(double temp) {
        this.temp = temp;
    }

    public String getFeels_like() {
        return String.format("%.02f", feels_like - KELVIN_DIFF);
        //return feels_like - KELVIN_DIFF;
    }

    public void setFeels_like(double feels_like) {
        this.feels_like = feels_like;
    }

    public String getTemp_min() {
        return String.format("%.02f", temp_min - KELVIN_DIFF);
        //return temp_min - KELVIN_DIFF;
    }

    public void setTemp_min(double temp_min) {
        this.temp_min = temp_min;
    }

    public String getTemp_max() {
        return String.format("%.02f", temp_max - KELVIN_DIFF);
        //return temp_max - KELVIN_DIFF;
    }

    public void setTemp_max(double temp_max) {
        this.temp_max = temp_max;
    }

    public Integer getPressure() {
        return pressure;
    }

    public void setPressure(Integer pressure) {
        this.pressure = pressure;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    @Override
    public String toString() {
        return "CityWeather [description=" + description + ", icon=" + icon + ", main=" + main + "]";
    }


    
}
