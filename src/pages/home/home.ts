import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    public url;
    public feeds;

    constructor(public navCtrl: NavController, private _loadController: LoadingController, private _alertController: AlertController, private _http: Http, private _inAppBrowser: InAppBrowser) {
        this.url = 'https://www.reddit.com/new.json';
    }

    ngOnInit() {
        this.load(this.url);
    }

    load(url: string): void {
        let loader = this._loadController.create({
            content: "Wait..."
        });

        loader.present();

        this._http
            .get(this.url)
            .map(res => res.json())
            .toPromise()
            .then(data => {
                loader.dismiss();

                if (this.feeds) {
                    this.feeds = this.feeds.concat(data.data.children);
                } else {
                    this.feeds = data.data.children;
                }

                this.feeds.forEach((feed) => {
                    if (!feed.data.thumbnail || feed.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1)
                        feed.data.thumbnail = 'http://www.redditstatic.com/icon.png';
                });
            })
            .catch(err => {
                loader.dismiss();

                this._alertController.create({
                    title: 'Sorry!',
                    subTitle: 'Failed To Fetch Content',
                    message: 'Content could not be retrieved. Please check your internet access.',
                    buttons: [{ text: 'Ok' }]
                }).present();
            });
    }

    open(url: string): void {
        this._inAppBrowser.create(url);
    }

    doInfinite(infiniteScroll): void {
        let after = '?after=' + (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : '';

        this.load(this.url + after);

        infiniteScroll.complete();
    }

    doRefresh(refresher): void {
        let before = '?before=' + this.feeds[0].data.name;

        this.load(this.url + before);

        refresher.complete();
    }
}
