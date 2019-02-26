import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CallbackComponent } from './callback.component';

@NgModule({
    declarations: [
        AppComponent,
        CallbackComponent
    ],
    imports: [
        AppRoutingModule,
        AuthModule.forRoot(),
        BrowserModule,
        CommentsModule,
        CoreModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
