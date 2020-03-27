package net.energytools.hiring;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/api/hiring", produces = MediaType.APPLICATION_JSON_VALUE)
public class HiringResource {

    private int counter = 0;
    private String loopABC = "A";

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "/counter", method = RequestMethod.GET)
    public ResponseEntity<CounterDTO> getCounter(final HttpServletRequest request) {
        final String requestType = request.getHeader("X-Request-Type");
        if (requestType != null && requestType.toLowerCase().equals("a") && loopABC == "A") {
            counter += 1;
            loopABC = "B";

            log.info("Request type A {}", counter);
            try {
                Thread.sleep(2000);
            } catch (final InterruptedException ignored) {
            }
        }else if (requestType != null && requestType.toLowerCase().equals("b") && loopABC == "B") {
            counter += 1;
            loopABC = "C";

            log.info("Request type B {}", counter);           
        }else if (requestType != null && requestType.toLowerCase().equals("c") && loopABC == "C") {
            counter += 1;
            loopABC = "A";

            log.info("Request type C {}", counter);           
        }   
        return ResponseEntity.ok(new CounterDTO(counter));
    }
}
