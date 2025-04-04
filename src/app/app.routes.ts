import { Routes } from '@angular/router';
import { VersionContentComponent } from './version-content/version-content.component';

export const routes: Routes = [
    { path: '**', component: VersionContentComponent}
];
