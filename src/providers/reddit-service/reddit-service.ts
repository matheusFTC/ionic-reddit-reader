import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class RedditServiceProvider {

    public url;

    constructor(private _http: Http) {
        this.url = 'https://www.reddit.com/new.json';
    }

    private get(url: string) {
        return this._http.get(url).map(res => res.json()).toPromise();
    }

    fetch() {
        return this.get(this.url);
    }

    before(name: string) {
        return this.get(this.url + '?before=' + name);
    }

    after(name: string) {
        return this.get(this.url + '?after=' + name);
    }
}