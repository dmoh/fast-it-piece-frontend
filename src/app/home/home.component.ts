import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {element} from "protractor";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  options: {} = {};
  constructor(
              private route: Router,
              ) { }

  ngOnInit(): void {
    this.options = {
        types: [],
        componentRestrictions: { country: 'FR' }
    };
  }

  ngOnDestroy(): void {

  }
}
