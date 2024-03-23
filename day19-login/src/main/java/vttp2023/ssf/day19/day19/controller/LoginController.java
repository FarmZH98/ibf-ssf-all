package vttp2023.ssf.day19.day19.controller;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import vttp2023.ssf.day19.day19.model.User;
import vttp2023.ssf.day19.day19.service.LoginService;

@Controller
@RequestMapping
public class LoginController {

    @Autowired
    LoginService loginService;
    
    @GetMapping(path={"/", "/index.html"})
    public ModelAndView defaultPage(HttpSession sess) {
        ModelAndView mav = new ModelAndView("index");
        User userCached = getUserCached(sess);
        mav.addObject("user", userCached);
        
        System.out.println("testing ok");
        
        //testing!
        //HashMap<String, User> testUsers = new HashMap<>();
        // User toPutInMapTestUser = new User();
        // toPutInMapTestUser.setUsername("testingUsername");
        // toPutInMapTestUser.setPasswordInput("testingPasswordInput");
        // testUsers.put(toPutInMapTestUser.getUsername(), toPutInMapTestUser);
        //sess.setAttribute("testing", testUsers);

        return mav;
    }

    private User getUserCached(HttpSession sess) {
        String currentUsername = (String) sess.getAttribute("currentUsername");
        //User user = (User) sess.getAttribute("user");
        if (null == currentUsername) {
            sess.setAttribute("usersMap", new HashMap<String, User>());
            return new User();
            //sess.setAttribute("user", user);
        }
        HashMap<String, User> usersMap =  (HashMap<String ,User>) sess.getAttribute("usersMap");

        System.out.println("coming from getUserCached" + currentUsername);

        return usersMap.get(currentUsername);
    }

    @PostMapping(path={"/logout"})
    public ModelAndView logout(HttpSession sess) {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("redirect:/");
        sess.invalidate();

        //clear session too

        return mav;
    }

    @PostMapping(path="/login")
    //public ModelAndView login(@RequestBody MultiValueMap<String, String> form) {
    public ModelAndView login(HttpSession sess, @RequestBody @ModelAttribute @Valid User user, BindingResult bindings) {
        
        //testing!
        //HashMap<String ,User> testUsers = (HashMap<String ,User>) sess.getAttribute("testing");
        // User CachedInMapUser = testUsers.get("testingUsername");
        // System.out.println("testing: " + CachedInMapUser.getUsername() + ". passwordInput: " + CachedInMapUser.getPasswordInput());
        //testUsers.put(user.getUsername(), user);
        


        ModelAndView mav = new ModelAndView();
        
        // System.out.println("Username: " + form.getFirst("username"));
        // System.out.println("PasswordInput: " + form.getFirst("passwordInput"));
        // User user = new User();
        // user.setUsername(form.getFirst("username"));

        // user.setPasswordInput(form.getFirst("passwordInput"));
        System.out.println(user.toString());
        
        User userCached = getUserCached(sess);
        
        //1st attempt = success
        if(user.getPasswordInput().equals(user.getPassword()) &&  user.getAttempts() == 0) {
            mav.setViewName("redirect:/success.html");
            System.out.println("success");
            //mav.addObject("user", user);
            return mav;
        }

        //2nd attempt = correct password
        if(user.getPasswordInput().equals(user.getPassword()) &&  user.getAttempts() > 0) {
            
            //check captcha
            if(user.getAnswer() == user.getNumber1() + user.getNumber2()) {
                mav.setViewName("redirect:/success.html");
            } else {
                mav.setViewName("redirect:/suspended.html");
                sess.invalidate();
                System.out.println("wrong captcha - suspend account");
            }
            
            
            System.out.println("2nd attempt = correct password");
            return mav;
        }

        

        //1st failed attempt
        if(!user.getPasswordInput().equals(user.getPassword()) && user.getAttempts() == 0) {
            user.addAttempts();
            mav.setViewName("index"); //chg to redirect instead
            //mav.addObject("isHide", true);
            List<Integer> numbers = loginService.generateCaptcha();
            user.setNumber1(numbers.get(0));
            user.setNumber2(numbers.get(1));

        } else { //2nd failed attempt
            user.addAttempts();
            sess.invalidate(); //alternatively, update hashmap to remove the username
            mav.setViewName("redirect:/suspended.html");
            return mav; //not the best palce to put lol
        }

        System.out.println(user.toString());
        HashMap<String, User> usersMap =  (HashMap<String ,User>) sess.getAttribute("usersMap");
        sess.setAttribute("currentUsername", user.getUsername());
        usersMap.put(user.getUsername(), user);

        mav.addObject("user", user);
        

        return mav;
    }
}
