import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { RedditReaderApp } from './app.component';
import { HomePage } from '../pages/home/home';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@NgModule({
    declarations: [
        RedditReaderApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(RedditReaderApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        RedditReaderApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        InAppBrowser,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }