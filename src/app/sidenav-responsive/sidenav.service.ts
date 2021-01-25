import { Injectable, EventEmitter} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SidenavService {
    private sidenav: MatSidenav;
    public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);


    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public open() {
        // this.sidenav.open();
        return this.sideNavToggleSubject.next(null);
    }


    public close() {
        // this.sidenav.close();
        return this.sideNavToggleSubject.next(null);
    }

    public toggleBis(): void {
        if (this.sidenav) {
            this.sidenav.toggle();
        }
    }

    public toggle() {
        return this.sideNavToggleSubject.next(null);
    }
}
