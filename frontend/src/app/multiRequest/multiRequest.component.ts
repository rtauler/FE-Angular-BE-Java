//import generics
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getQueryValue } from '@angular/core/src/view/query';
import { Subscription, forkJoin, Observable, from, of } from 'rxjs';



//import interface and array
import { Request } from '../request';
import { REQUESTS } from '../request-list';

//import delayer
import { delay, concatMap, tap, mergeMap, scan, switchMap, } from 'rxjs/operators';

//import timer
import { timer } from 'rxjs';

//import spinner library
import { NgxSpinnerService } from "ngx-spinner";
import { analyzeAndValidateNgModules } from '@angular/compiler';

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
    requests = REQUESTS;
    selectedRequest: Request;

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
                    console.log(res.value)
                    this.lastValue = res.value;
                    REQUESTS.push({ type: "A", number: res.value })
                }),
                concatMap(() => this.http.get(this.backendUrl, { headers: new HttpHeaders({ 'X-Request-Type': 'B' }) })
                    .pipe(delay(100))),
                tap((res: ICounterDTO) => {
                    console.log(res.value)
                    this.lastValue = res.value;
                    REQUESTS.push({ type: "B", number: res.value })
                }),
                concatMap(() => this.http.get(this.backendUrl, { headers: new HttpHeaders({ 'X-Request-Type': 'C' }) })
                    .pipe(delay(100))),
                tap((res: ICounterDTO) => {
                    console.log(res.value)
                    this.lastValue = res.value;
                    REQUESTS.push({ type: "C", number: res.value })
                    //stop spinner
                    this.spinner.hide();
                    //stop timer
                    setTimeout(() => { subscribe.unsubscribe(); }, 0);
                }),
            ).subscribe();
        
    }
}
