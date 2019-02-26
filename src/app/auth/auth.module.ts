import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AngularFireAuthModule
    ]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                AuthGuard
            ]
        };
    }
}
