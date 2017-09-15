import { Component, OnInit, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, ActionSheetController, LoadingController, NavController, Content } from 'ionic-angular';
import { RedditServiceProvider } from '../../providers/reddit-service/reddit-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    @ViewChild(Content) content: Content;

    public feeds;
    public isLoaded;
    public hasFilter;
    public noFilter;
    public title;

    constructor(public navCtrl: NavController
        , private _loadController: LoadingController
        , private _alertController: AlertController
        , private _inAppBrowser: InAppBrowser
        , private _actionSheetController: ActionSheetController
        , private _redditServiceProvider: RedditServiceProvider) {

        this.isLoaded = true;
        this.hasFilter = false;
    }

    ngOnInit() {
        this.load(undefined, undefined);
    }

    load(before: string, after: string): void {
        if (this.isLoaded) {
            this.isLoaded = false;

            let loader = this._loadController.create({
                content: "Wait..."
            });

            loader.present();

            let promise;

            if (before) {
                promise = this._redditServiceProvider.before(before);
            } else if (after) {
                promise = this._redditServiceProvider.after(after);
            } else {
                promise = this._redditServiceProvider.fetch();
            }

            promise
                .then(data => {
                    loader.dismiss();

                    this.isLoaded = true;

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

                    this.isLoaded = true;

                    this._alertController.create({
                        title: 'Sorry!',
                        subTitle: 'Failed To Fetch Content',
                        message: 'Content could not be retrieved. Please check your internet access.',
                        buttons: [{ text: 'Ok' }]
                    }).present();
                });
        }
    }

    open(url: string): void {
        this._inAppBrowser.create(url);
    }

    doInfinite(infiniteScroll): void {
        let after = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : '';

        this.load(undefined, after);

        infiniteScroll.complete();
    }

    doRefresh(refresher): void {
        let before = this.feeds[0].data.name;

        this.load(before, undefined);

        refresher.complete();
    }

    filters(): void {
        this.content.scrollToTop();

        let actionSheet = this._actionSheetController.create({
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

    search() {
        this.hasFilter = false;

        this.feeds = this.noFilter.filter((item) => {
            return item.data.title.toLowerCase().indexOf(this.title.toLowerCase()) > -1;
        });
    }
}
