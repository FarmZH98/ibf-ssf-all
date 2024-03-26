package sg.edu.nus.iss.sffpracticetest.controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
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
        if(session.getAttribute("exist") == null) {
            mav.setViewName("refused");
            return mav;
        }
        mav.setViewName("redirect:/listing");
        //mav.addObject("taskList", taskService.getAllTasks());

        return mav;
    }

    @GetMapping(path={"/listing"}) 
    public ModelAndView getTaskList(HttpSession session) {
        ModelAndView mav = new ModelAndView();
        if(session.getAttribute("exist") == null) {
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
        if(session.getAttribute("exist") == null) {
            session.setAttribute("exist", 1);
        }
        mav.addObject("user", new User());
        return mav;
    }

    @GetMapping(path={"/Pending"})
    public ModelAndView getPendingTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("pending"));
        if(session.getAttribute("exist") == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/Started"})
    public ModelAndView getStartedTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("started"));
        if(session.getAttribute("exist") == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/Progress"})
    public ModelAndView getProgressTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("in_progress"));
        if(session.getAttribute("exist") == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/Completed"})
    public ModelAndView getCompletedTasks(HttpSession session) throws ParseException {
        ModelAndView mav = new ModelAndView("listing");
        mav.addObject("taskList", taskService.getSpecificTasks("completed"));
        if(session.getAttribute("exist") == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @GetMapping(path={"/add"})
    public ModelAndView returnAddPage(HttpSession session)  {
        ModelAndView mav = new ModelAndView("add");
        mav.addObject("task", new Task());
        if(session.getAttribute("exist") == null) {
            mav.setViewName("refused");
            return mav;
        }

        return mav;
    }

    @PostMapping(path={"/add/task"})
    public ModelAndView addTask(HttpSession session, @RequestBody @Valid @ModelAttribute Task task, BindingResult binding) {

        ModelAndView mav = new ModelAndView();
        System.out.println("addTask(): >>>");
        
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }
        if (binding.hasErrors()) {
            System.out.println("binding error: >> " + binding.getAllErrors());
            mav.setViewName("add");
            mav.addObject("task", task);
            return mav;
        }

        taskService.saveTask(task);
        mav.addObject("task", task);
        mav.setViewName("task");

        return mav;
    }

    @GetMapping("/delete/{id}")
    public String deleteTask (@PathVariable("id") String id){
        System.out.println("deleteTask() >>>");

        taskService.deleteTask(id);

        return "redirect:/listing";
    }

    @GetMapping("/edit/{id}")
    public String editTask (@PathVariable("id") String id, HttpServletResponse response, Model model){
        
        Task task = taskService.getTaskById(id);
        if(null != task){            
            model.addAttribute("task", task);
            return "edit";
        }else{
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            System.out.println("editTask() >>> unable to find ID");
            return "redirect:/listing";
        }
    }

    @PostMapping(path={"/edit/task"})
    public ModelAndView editTask(HttpSession session, @RequestBody @Valid @ModelAttribute Task task, BindingResult binding) {

        ModelAndView mav = new ModelAndView();
        System.out.println("editTask(): >>>");
        
        if(session == null) {
            mav.setViewName("refused");
            return mav;
        }
        if (binding.hasErrors()) {
            System.out.println("binding error: >> " + binding.getAllErrors());
            mav.setViewName("edit");
            mav.addObject("task", task);
            return mav;
        }

        taskService.editTask(task);
        mav.addObject("task", task);
        mav.setViewName("task");

        return mav;
    }
}
