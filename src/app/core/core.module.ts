import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './loading.component';
import { ErrorComponent } from './error.component';
import { ApiService } from './api.service';

@NgModule({
    declarations: [
        ErrorComponent,
        HeaderComponent,
        LoadingComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [
        ErrorComponent,
        FormsModule,
        HeaderComponent,
        LoadingComponent
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                Title,
                DatePipe,
                ApiService
            ]
        };
    }
}
