import { forkJoin } from 'rxjs/observable/forkJoin';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translator } from 'angular-translator';
import { AppSettings } from '../services/app-settings';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {
  
  reqs: Observable<string>[];
  dataArray: string[];
  dataSet: Map<string, string>;
  data = '';
  dataCs = '';
  dataEn = '';
  loading: boolean;

  constructor(private http: HttpClient, private translator: Translator, private settings: AppSettings, private router: Router, private appSettings: AppSettings) {
    this.reqs = [];
    this.dataArray = [];
    this.dataSet = new Map<string, string>();
    if (!settings.faqPage) {
      this.router.navigate([this.settings.getRouteFor('')]);
    }
  }

  ngOnInit() {
    this.loading = true;
    this.translator.languageChanged.subscribe(() => {
      this.localeChanged();
    });
    for(const [key, element] of Object.entries(this.appSettings.faqPage)){
      this.reqs.push(this.http.get(element, { observe: 'response', responseType: 'text' })
      .map(response => response['body']));
  }
  forkJoin(this.reqs)
  .subscribe( result => {
    for(const element in result)
      this.dataArray.push(result[element]);
    let keys = Object.keys(this.appSettings.faqPage);
    for(let i = 0; i < this.dataArray.length; i++){
      this.dataSet.set(keys[i], this.dataArray[i]);
    }

    this.localeChanged();
    this.loading = false;
  },
  error => {
    this.loading = false;
  });
  }

  private localeChanged() {
    this.data = this.dataSet.get(this.translator.language);
  }

}
