package ibf2024.ssf.day17.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import ibf2024.ssf.day17.models.GiphyImage;
import ibf2024.ssf.day17.service.GiphyService;
import jakarta.validation.Valid;

@Controller
@RequestMapping()
public class GiphyImageController {

    @Autowired
    GiphyService giphyService;

    @RequestMapping(path = "/giphy/search")
    public ModelAndView getGameList(@RequestParam String imageTitle) {


        ModelAndView mav = new ModelAndView("image");
        List<GiphyImage> imgList = giphyService.search(imageTitle);
        mav.addObject("imgList", imgList);

        return mav;

    }

    
}
