package sg.edu.nus.iss.sffpracticetest.utils;

import java.util.Date;

public class Utils {
    public static final String REDIS_ONE = "redismap";
    
    public static final String FILE_PATH = "todos.txt";

    public static final String KEY_TASK = "task";  

    public static long dateToEpoch(Date date) {
        
        //SimpleDateFormat df = new SimpleDateFormat("EEE, MM/dd/yyyy");
       // System.out.println("Ori date: " + date);


        return date.getTime();
    }

    public static Date epochToDate(long epochDate) {
        Date convertBackDate = new Date (epochDate);
        //System.out.println("Converted back date: " + convertBackDate);

        return convertBackDate;
    }
}
