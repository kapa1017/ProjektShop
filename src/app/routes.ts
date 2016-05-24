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

import {RouteDefinition} from 'angular2/router';

import Home from './home';
import SucheKunden from '../kundenverwaltung/component/suche_kunden/suche_kunden';
import SucheKundebyBestellungId from '../kundenverwaltung/component/suche_kunde_by_bestellungid/suche_kunde_by_bestellungid';
import DetailsKunde from '../kundenverwaltung/component/details_kunde/details_kunde';
import UpdateKunde from '../kundenverwaltung/component/update_kunde/update_kunde';
import UpdatePrivatkunde from '../kundenverwaltung/component/update_kunde/update_kunde_privat';
import CreateMultimedia from '../kundenverwaltung/component/create_multimedia/create_multimedia';
import SucheMultimedia from '../kundenverwaltung/component/suche_multimedia/suche_multimedia';
/* tslint:disable:max-line-length */
import BalkendiagrammBewertungen from '../kundenverwaltung/component/balkendiagramm_bewertungen/balkendiagramm_bewertungen';
import LiniendiagrammBewertungen from '../kundenverwaltung/component/liniendiagramm_bewertungen/liniendiagramm_bewertungen';
import TortendiagrammBewertungen from '../kundenverwaltung/component/tortendiagramm_bewertungen/tortendiagramm_bewertungen';
/* tslint:enable:max-line-length */

// Router DSL:
// https://angular.io/docs/ts/latest/guide/router.html
// https://github.com/angular/angular/issues/5557
/**
 * Konstante f&uuml;r ein JSON-Objekt zu allen Routes mit dem Route-Namen
 * als Schl&uuml;ssel.
 */
const APP_ROUTES: any = {
    homeDef: {path: '/home', name: 'Home', component: Home, useAsDefault: true},
    // home: {path: '/', name: 'Home', component: Home},
    sucheKundenDef:
        {path: '/sucheKunden', name: 'SucheKunden', component: SucheKunden},
    sucheKundebyBestellungIdDef: {
        path: '/sucheKundebyBestellungId',
        name: 'SucheKundebyBestellungId',
        component: SucheKundebyBestellungId
    },
    detailsKundeDef: {
        path: '/detailsKunde/:id',
        name: 'DetailsKunde',
        component: DetailsKunde
    },
    updateKundeDef:
        {path: '/updateKunde/:id', name: 'UpdateKunde', component: UpdateKunde},
    updatePrivatekundeDef: {
        path: '/updatePrivatkunde/:id',
        name: 'UpdatePrivatkunde',
        component: UpdatePrivatkunde
    },
    balkendiagrammDef: {
        path: '/balkendiagramm',
        name: 'Balkendiagramm',
        component: BalkendiagrammBewertungen
    },
    liniendiagrammDef: {
        path: '/liniendiagramm',
        name: 'Liniendiagramm',
        component: LiniendiagrammBewertungen
    },
    tortendiagrammDef: {
        path: '/tortendiagramm',
        name: 'Tortendiagramm',
        component: TortendiagrammBewertungen
    },
    createMultimediaDef: {
        path: '/createMultimedia',
        name: 'CreateMultimedia',
        component: CreateMultimedia
    },
    sucheMultimediaDef: {
        path: '/sucheMultimedia',
        name: 'SucheMultimedia',
        component: SucheMultimedia
    },
    redirect: {path: '/', redirectTo: ['Home']}
};
export default APP_ROUTES;

// https://angular.io/docs/ts/latest/guide/router.html
/**
 * Route-Definitionen zur Verwendung bei @RouteConfig in der Komponente
 * <a href="../classes/_app_app_.default.html">App</a>.
 * Abgeleitet aus <a href="#app_routes">APP_ROUTES</a>.
 */
export const APP_ROUTE_DEFINITIONS: Array<RouteDefinition> =
    Object.keys(APP_ROUTES).map((key: string) => APP_ROUTES[key]);
