import { Component, OnInit } from '@angular/core';
import { Request } from '../request';
import { REQUESTS } from '../request-list';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  requests = REQUESTS;
  selectedRequest: Request;

  constructor() { }

  ngOnInit() {
  }

}
