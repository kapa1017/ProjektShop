/*
 * Copyright (C) 2015 - 2016 Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* tslint:disable:max-line-length */
import {Component} from 'angular2/core';
import {ChartService} from '../shared/shared';

import KundenService from '../kundenverwaltung/service/kunden_service';
import KundeRegistrierungService from '../registrierungsverwaltung/service/kundeRegistrierung_service';
// import ArtikelsService from
// '../artikelverwaltung/service/artikels_service';
/*import KundenServiceMockServer from
'../kundenverwaltung/service/mock/kunden_service_mock_server';*/
/* import KundenServiceMockObjects from
'../kundenverwaltung/service/mock/kunden_service_mock_objects';*/
import KUNDEN_SERVICE_PROVIDER from
'../kundenverwaltung/service/kunden_service';
import KUNDEREGISTRIERUNG_SERVICE_PROVIDER from
'../registrierungsverwaltung/service/kundeRegistrierung_service';
/*import ARTIKELS_SERVICE_PROVIDER from
'../artikelverwaltung/service/artikels_service';*/

// import {MOCK_SERVER_PROVIDER}
// from '../kundenverwaltung/service/mock/kunden_service_mock_server';
// import {MOCK_OBJECTS_PROVIDER}
// from '../kundenverwaltung/service/mock/kunden_service_mock_objects';
/* tslint:enable:max-line-length */

/**
 * Komponente f&uuml;r den Hauptteil einer Seite mit dem Tag &lt;app-main&gt;.
 */
@Component({
    selector: 'app-main',
    // Provider fuer die Main-Komponente und ihre Kindkomponenten,
    // d.h. Singletons innerhalb dieses Teilbaums
    providers: [
        ChartService, KundenService, KundeRegistrierungService,
        // KundenServiceMockServer,
        // ArtikelsService,
        // KundenServiceMockObjects,
        KUNDEN_SERVICE_PROVIDER, KUNDEREGISTRIERUNG_SERVICE_PROVIDER
        // ARTIKELS_SERVICE_PROVIDER
        // MOCK_SERVER_PROVIDER
        // MOCK_OBJECTS_PROVIDER
    ],
    template: `
        <main class="col-xs-12 col-sm-8 col-md-9 col-lg-9 col-xl-9">
            <!-- Abstand: margin top 1 rem -->
            <!-- http://v4-alpha.getbootstrap.com/components/utilities -->
            <div class="m-t-1">
                <!-- Komponente fuer das Routing, d.h. Platzhalter fuer den -->
                <!-- Austausch der HTML-Templates (= Fragmente) -->
                <!-- FIXME router-outlet wird zu router-viewport, -->
                <!--       RouterOutlet zu RouterViewport -->
                <!--       https://github.com/angular/angular/issues/4679 -->
                <!-- viewport: framed area on a display screen for viewing information -->
                <router-outlet></router-outlet>
            </div>
        </main>
    `
})
export default class Main {
    constructor() { console.log('Main.constructor()'); }
}
