package nus.iss.edu.sg.day16workshop.model;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

public class Game implements Serializable{
    // put in the relevant validations you feel required yourself
    // to practice and test your understanding on spring validation

    private String gameId;
    private String homeTeam;
    private String oppTeam;
    private String venue;
    private Date gameDate;


    public Game() {
        this.gameId = UUID.randomUUID().toString();
    }

    public Game(String homeTeam, String oppTeamString, String venue, Date gameDate) {
        this.gameId = UUID.randomUUID().toString();
        this.homeTeam = homeTeam;
        this.oppTeam = oppTeamString;
        this.venue = venue;
        this.gameDate = gameDate;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }

    public String getOppTeam() {
        return oppTeam;
    }

    public void setOppTeam(String oppTeamString) {
        this.oppTeam = oppTeamString;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public Date getGameDate() {
        return gameDate;
    }

    public void setGameDate(Date gameDate) {
        this.gameDate = gameDate;
    }

    @Override
    public String toString() {
        return "Game [gameId=" + gameId + ", homeTeam=" + homeTeam + ", oppTeam=" + oppTeam + ", venue=" + venue
                + ", gameDate=" + gameDate + "]";
    }

    

    
}
