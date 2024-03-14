package ibf2023.ssf.day13.controller;

import java.util.LinkedList;
import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import ibf2023.ssf.day13.model.task;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;


@Controller
@RequestMapping()
public class TodoController {

    //this is the default page when user loads
    @GetMapping(path = {"/", "/index.html"}) 
    public ModelAndView getIndex (HttpSession sess) {
        ModelAndView mav = new ModelAndView("todo");

        List<task> todoList = getTodoList(sess);
        mav.addObject("task", new task(null, null, null));
        mav.addObject("todoList", todoList);

        return mav;
    }

    private List<task> getTodoList(HttpSession sess) {
        List<task> todoList = (List<task>) sess.getAttribute("todoList");

        //check if todoList is empty/null
        if(null == todoList) {
            todoList = new LinkedList<>();
            sess.setAttribute("todoList", todoList);
        }

        return todoList;
    }

    @RequestMapping(path="/task")
    public ModelAndView mav (HttpSession sess, @ModelAttribute @Valid task task , BindingResult bindings) {
        
        ModelAndView mav = new ModelAndView("todo");

        List<task> todoList = getTodoList(sess);
        mav.addObject("todoList", todoList);
        System.out.println("ok1");
        System.out.println(todoList);

        if(bindings.hasErrors()) { // Syntactic validation
            mav.addObject("task", task);
            System.out.println("nok1");
            System.err.println(bindings.getFieldErrors());
            mav.setStatus(HttpStatusCode.valueOf(400));
        } else if ("nothing".equals(task.getTask())) { // Semantic validation
            FieldError err = new FieldError("task", "task", "You cannot put nothing");
            bindings.addError(err);
            mav.addObject("item", task);

            ObjectError objErr = new ObjectError("globalError", "This error belongs to the form"); // need to add another corresponding in html
            bindings.addError(objErr);
        } else {
            mav.addObject("task", new task(null, null, null));
            todoList.add(task); //question: will session save the task into cookie automatically?? => yes. because we already set attribute into session during first creation
            // POST-redirect-GET. This is to avoid when user refreshing will resubmit a task due to caching. If we go to original html, refreshing wont submit anything
            mav.setViewName("redirect:/"); //interestingly, after we add this, refreshing doesn't remove the cookie :D
            System.out.println("ok2");
        }

        System.out.println("ok3");
        
        return mav;
    }


}


//    @PostMapping(path="/checkout")
//    public String postMethodName(HttpSession sess) {
//        //TODO: process POST request
//        List<Item> cart = getCart(sess);

//        System.out.println(">>>> cart: " + cart);

//        // perform checkout
//        // destroy the session for the NEXT request
//        sess.invalidate();
       
//        return "thankyou";
//    }
   
//    @PostMapping(path="/cart2")
//    public ModelAndView postCart2(HttpSession sess,
//          @ModelAttribute @Valid Item item , BindingResult bindings) {

//       ModelAndView mav = new ModelAndView("cart");

//       List<Item> cart = getCart(sess);

//       mav.addObject("cart", cart);

//       // Syntactic validation
//       if (bindings.hasErrors()) 
//          mav.addObject("item", item);

//       // Semantic validation
//       else if ("apple".equals(item.getName())) {
//          System.out.printf(">>>> apple error");
//          FieldError err = new FieldError("item", "name", "We don't sell apple here");
//          bindings.addError(err);
//          mav.addObject("item", item);
//          System.out.printf(">>>> sem validation item: %s\n", item);

//          ObjectError objErr = new ObjectError("globalError", "This error belongs to the form");
//          bindings.addError(objErr);

//       } else {
//          mav.addObject("item", new Item());
//          cart.add(item);
//       }

//       System.out.printf(">>>> item: %s\n", item);

//       return mav;
//    }
   
//    @PostMapping(path="/cart")
//    public ModelAndView postCart(@RequestBody MultiValueMap<String, String> form
//          , @RequestParam String name, @RequestParam int quantity, @RequestBody String payload) {

//       ModelAndView mav = new ModelAndView();
//       mav.setViewName("cart");

//       // Validate item
//       if (quantity <= 0) {
//          mav.setStatus(HttpStatusCode.valueOf(400));
//          return mav;
//       }

//       System.out.printf(">>>> name: %s\n", name);
//       System.out.printf(">>>> payload: %s\n", payload);
//       System.out.printf(">>>> form: %s\n", form);
       
//       return mav;
//    }

