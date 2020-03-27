//import generics
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import delayer 
import { delay, concatMap, tap, } from 'rxjs/operators';

//import timer
import { timer } from 'rxjs';

//import spinner library
import { NgxSpinnerService } from "ngx-spinner";

interface ICounterDTO { 
    type: string;
    value: number;
};

@Component({
    selector: 'app-multi-request',
    templateUrl: './multiRequest.component.html',
    styleUrls: ['./multiRequest.component.scss']
})
export class MultiRequestComponent implements OnInit {
    //define variables
    private backendUrl = 'http://localhost:8080/api/hiring/counter';
    public lastValue = 0;
    public timerData = 0;
    public requests = [];

    constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        console.log('Starting http requests');
        this.fetchValue();
    }


    public fetchValue(): void {
        //define timer and start it
        const source = timer(0, 5);
        const subscribe = source.subscribe(
            val => this.timerData = val,
        );

        //start spinner
        this.spinner.show();

        this.http.get(this.backendUrl, { headers: new HttpHeaders({ 'X-Request-Type': 'A' }) })
            .pipe(delay(100),
                tap((res: ICounterDTO) => {
                    console.log(res.value);
                    this.requests.push({ type: "A", value: res.value })
                }),
                concatMap(() => this.http.get(this.backendUrl, { headers: new HttpHeaders({ 'X-Request-Type': 'B' }) })
                    .pipe(delay(100))),
                tap((res: ICounterDTO) => {
                    console.log(res.value)
                    this.requests.push({ type: "B", value: res.value })
                }),
                concatMap(() => this.http.get(this.backendUrl, { headers: new HttpHeaders({ 'X-Request-Type': 'C' }) })
                    .pipe(delay(100))),
                tap((res: ICounterDTO) => {
                    console.log(res.value)
                    this.requests.push({ type: "C", value: res.value })
                    //stop spinner
                    this.spinner.hide();
                    //stop timer
                    setTimeout(() => { subscribe.unsubscribe(); }, 0);
                }),
            ).subscribe();    
    }
}
