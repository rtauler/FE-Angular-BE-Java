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
    private int counterS;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "/counter", method = RequestMethod.GET)
    public ResponseEntity<CounterDTO> getCounter(final HttpServletRequest request) {
        final String requestType = request.getHeader("X-Request-Type");

        if (counter == 0) {
            log.info("Counter is initial", counter);
            counterS = 0;
        } else if (counter != 0 && counter % 2 != 0 && counter % 3 != 0) {
            log.info("Counter is divisible not by 2 nor by 3", counter);
            counterS = 1;
        } else if (counter != 0 && counter % 2 == 0) {
            log.info("Counter is divisible by 2", counter);
            counterS = 2;
        } else if (counter != 0 && counter % 3 == 0) {
            log.info("Counter is divisible by 3", counter);
            counterS = 3;
        }

        // When request is A
        if (requestType != null && requestType.toLowerCase().equals("a") && counterS == 0
                || requestType != null && requestType.toLowerCase().equals("a") && counterS == 3) {
            counter += 1;
            // custom log of info to better readability
            log.info("Request type A {}", counter);
            try {
                Thread.sleep(2000);
            } catch (final InterruptedException ignored) {
            }
        }

        // When request is B
        else if (requestType != null && requestType.toLowerCase().equals("b") && counterS == 1) {
            counter += 1;

            // custom log of info to better readability
            log.info("Request type B {}", counter);
        }

        else if (requestType != null && requestType.toLowerCase().equals("c") && counterS == 2) {
            counter += 1;

            // custom log of info to better readability
            log.info("Request type C {}", counter);
        }
        return ResponseEntity.ok(new CounterDTO(counter));
    }

}
