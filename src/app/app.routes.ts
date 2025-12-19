import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'chat',
        loadComponent: () => 
            import('./pages/chat/chat.component').then((com) => com.ChatComponent)
    },
    {
        path: 'login',
        loadComponent: () => 
            import('./pages/login/login.component').then((com) => com.LoginComponent)
    },
    {
        path: '', // if user enter empty, they get redirected to log in
        loadComponent: () => 
            import('./pages/login/login.component').then((com) => com.LoginComponent)
    },
];
