package sg.edu.nus.iss.sffpracticetest.controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpSession;
import sg.edu.nus.iss.sffpracticetest.model.Task;
import sg.edu.nus.iss.sffpracticetest.model.User;
import sg.edu.nus.iss.sffpracticetest.service.TaskService;

@Controller
@RequestMapping
public class TaskController {

    @Autowired
    TaskService taskService;
    
    @PostMapping(path={"/login"})
    public ModelAndView getAllTasks(HttpSession session, @RequestBody @ModelAttribute User user) throws ParseException {
        //check httpsession -> listing.html or refused.html
        ModelAndView mav = new ModelAndView("");
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }
        mav.setViewName("listing");
        mav.addObject("taskList", taskService.getAllTasks());

        return mav;
    }

    @GetMapping(path={"/", "index.html"}) 
    public ModelAndView loginPage(HttpSession session) {
        ModelAndView mav = new ModelAndView("login");
        if(session == null) {
            session.setAttribute("exist", 1);
            return mav;
        }
        mav.addObject("user", new User());
        return mav;
    }

    @GetMapping(path={"/Pending"})
    public ModelAndView getPendingTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("pending"));
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/Started"})
    public ModelAndView getStartedTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("started"));
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/Progress"})
    public ModelAndView getProgressTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("in_progress"));
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/Completed"})
    public ModelAndView getCompletedTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("completed"));
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/add"})
    public ModelAndView returnAddPage(HttpSession session)  {
        ModelAndView mav = new ModelAndView("add");
        mav.addObject("newTask", new Task());
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @PostMapping(path={"/add/task"})
    public ModelAndView addTask(HttpSession session, @RequestBody @ModelAttribute Task task) {
        ModelAndView mav = new ModelAndView("task");
        taskService.saveTask(task);
        mav.addObject("task", task);
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }
}
