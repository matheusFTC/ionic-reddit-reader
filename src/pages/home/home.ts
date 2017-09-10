import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, ActionSheetController, LoadingController, NavController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    public url;
    public feeds;
    public hasFilter;
    public noFilter;

    constructor(public navCtrl: NavController
        , private _loadController: LoadingController
        , private _alertController: AlertController
        , private _http: Http
        , private _inAppBrowser: InAppBrowser
        , public actionSheetController: ActionSheetController) {
            
        this.url = 'https://www.reddit.com/new.json';
        this.hasFilter = false;
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

                this.noFilter = this.feeds;
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

    filters(): void {
        let actionSheet = this.actionSheetController.create({
            title: 'Filter options:',
            buttons: [
                {
                    text: 'Music',
                    handler: () => {
                        this.feeds = this.noFilter.filter((feed) => feed.data.subreddit.toLowerCase() === "music");
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Movies',
                    handler: () => {
                        this.feeds = this.noFilter.filter((feed) => feed.data.subreddit.toLowerCase() === "movies");
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Games',
                    handler: () => {
                        this.feeds = this.noFilter.filter((feed) => feed.data.subreddit.toLowerCase() === "gaming");
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Pictures',
                    handler: () => {
                        this.feeds = this.noFilter.filter((feed) => feed.data.subreddit.toLowerCase() === "pics");
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Ask Reddit',
                    handler: () => {
                        this.feeds = this.noFilter.filter((feed) => feed.data.subreddit.toLowerCase() === "askreddit");
                        this.hasFilter = true;
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.feeds = this.noFilter;
                        this.hasFilter = false;
                    }
                }
            ]
        });

        actionSheet.present();
    }
}
