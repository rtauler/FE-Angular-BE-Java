//import generics
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getQueryValue } from '@angular/core/src/view/query';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

//import delayer
import { delay } from 'rxjs/operators';

//import timer
import { timer } from 'rxjs';

//import spinner library
import { NgxSpinnerService } from "ngx-spinner";

//import list of requests
import { REQUESTS } from '../request-list';


interface ICounterDTO {
    value: number;
}

@Component({
    selector: 'app-multi-request',
    templateUrl: './multiRequest.component.html',
    styleUrls: ['./multiRequest.component.css']
})
export class MultiRequestComponent implements OnInit {
    //define variables
    private backendUrl = 'http://localhost:8080/api/hiring/counter';
    public lastValue = 0;
    public timerData = 0;

    constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        console.log('Starting http requests');
        this.fetchValue();
    }

    fetchValue(): void {
        //define timer and start it
        const source = timer(0,1);
        const subscribe = source.subscribe(
            val => this.timerData = val,
        );
        
        //start spinner
        this.spinner.show();
        //start request1-A
        this.http.get(this.backendUrl,
            { headers: new HttpHeaders({ 'X-Request-Type': 'A' }) }).subscribe((result: ICounterDTO) => {
                
                //log value
                console.log(result.value);

                //make value available on html
                this.lastValue = result.value;

                //push value into requests array
                REQUESTS.push({ type: "A", number: result.value })
                
                //start request2-B (this http requests is delayed 100ms as per requirements)
                this.http.get(this.backendUrl,
                    { headers: new HttpHeaders({ 'X-Request-Type': 'B' }) }).pipe(delay(100)).subscribe((result: ICounterDTO) => {
                        
                        //log delay
                        console.log("delayed 100ms");

                        //log value
                        console.log(result.value);

                        //make value available on html
                        this.lastValue = result.value;

                        //push value into requests array
                        REQUESTS.push({ type: "B", number: result.value })

                        //start request3-C (this http requests is delayed 100ms as per requirements)
                        this.http.get(this.backendUrl,
                            { headers: new HttpHeaders({ 'X-Request-Type': 'C' }) }).pipe(delay(100)).subscribe((result: ICounterDTO) => {
                                
                                //log delay
                                console.log("delayed 100ms");

                                //log value
                                console.log(result.value);

                                //make value available on html
                                this.lastValue = result.value;

                                //push value into requests array
                                REQUESTS.push({ type: "C", number: result.value })
                                
                                //stop spinner
                                this.spinner.hide();

                                //stop timer
                                setTimeout(() => { subscribe.unsubscribe(); }, 0);
                            });
                    });
            });
    }
}
