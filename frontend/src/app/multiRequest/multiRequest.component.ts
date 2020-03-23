//import generics
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getQueryValue } from '@angular/core/src/view/query';
import { Subscription, forkJoin, Observable, from } from 'rxjs';
import { switchMap, concatMap, tap, mergeMap, scan } from 'rxjs/operators';



//import interface and array
import { Request } from '../request';
import { REQUESTS } from '../request-list';

//import delayer
import { delay } from 'rxjs/operators';

//import timer
import { timer } from 'rxjs';

//import spinner library
import { NgxSpinnerService } from "ngx-spinner";

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


        //start request1-A 


        const test = () =>
            forkJoin(this.backendUrl)
                .pipe(
                    delay(1000),
                    tap(
                        result =>
                        this.http.get(this.backendUrl).subscribe((result: ICounterDTO) => {
                            console.log(result.value);

                        })
                    )
                )
                .pipe(
                    delay(1000),
                    tap(
                        result =>
                        this.http.get(this.backendUrl).subscribe((result: ICounterDTO) => {
                            console.log(result.value);

                        })
                    )
                )
                .subscribe();

        document.getElementById("button").onclick = test;
    }
}
