package sg.edu.nus.iss.day14.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/home")
public class HomeController {
    
    @GetMapping("/pagea")
    public String pageA(Model model, HttpSession httpSession) {
        return "pagea";
    }

    @PostMapping("/pagea") 
    public String postPageA(@RequestBody MultiValueMap<String,String> form, HttpSession httpSession, Model model) {

        String fullname = form.getFirst("fullname");

        httpSession.setAttribute("fullname", fullname);
        model.addAttribute("fullname", httpSession.getAttribute("fullname"));

        //go to pageb.html
        return "pageb";
    }

    @GetMapping("/pagec")
    public String navigateToPageC(HttpSession httpSession, Model model) {
        String fullname = httpSession.getAttribute("fullname").toString();
        model.addAttribute("fullname", httpSession.getAttribute("fullname"));

        return "pagec";
    }

    @GetMapping("/page0")
    public String redirectBacktoPageA(HttpSession htppSession) {
        htppSession.invalidate(); //clear cookie

        return "redirect:/home/pagea";
    }
}
