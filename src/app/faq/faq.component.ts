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
  
  private dataSet: Map<string, string>;
  data = '';
  loading: boolean;

  constructor(private http: HttpClient, private translator: Translator, private appSettings: AppSettings, private router: Router) {
    this.dataSet = new Map<string, string>();
    if (!appSettings.faqPage) {
      this.router.navigate([this.appSettings.getRouteFor('')]);
    }
  }
  ngOnInit() {
    this.loading = true;
    this.translator.languageChanged.subscribe(() => {
      this.localeChanged();
    });
    const reqs = [];
    const dataArray = [];
    for(const [key, element] of Object.entries(this.appSettings.faqPage)){
        reqs.push(this.http.get(element, { observe: 'response', responseType: 'text' })
        .map(response => response['body']));
    }
    forkJoin(reqs)
    .subscribe( result => {
      for(const element in result) {
        dataArray.push(result[element]);
      }
      let keys = Object.keys(this.appSettings.faqPage);
      for(let i = 0; i < dataArray.length; i++){
        this.dataSet.set(keys[i], dataArray[i]);
      }
      this.localeChanged();
      this.loading = false;
    },
    error => {
      this.loading = false;
    });
  }

  private localeChanged() {
    if (this.dataSet.has(this.translator.language)) {
      this.data = this.dataSet.get(this.translator.language);
    } else {
      this.data = this.dataSet.get('en') || this.dataSet.get('cs')
    }
  }

}
