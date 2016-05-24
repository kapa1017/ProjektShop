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

import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {isAdmin} from '../iam/iam';

/**
 * Komponente f&uuml;r die Navigationsleiste mit dem Tag &lt;app-nav&gt;.
 */
@Component({
    selector: 'app-nav',
    // Internationalisierung durch z.B. https://github.com/ocombe/ng2-translate
    template: `
        <nav class="navbar navbar-dark bg-inverse" >
            <!-- http://v4-alpha.getbootstrap.com/components/list-group/#linked-items -->
            <!-- Alternative CSS-Klassen fuer list-group: navs, nav-item, nav-link -->
            <!-- http://v4-alpha.getbootstrap.com/components/navs -->
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">NavBar</a>
                </div>
                    <ul class="nav navbar-nav" >
                        <li class="nav-item">
                            <a class="nav-link" [routerLink]="['Home']">
                                <i class="fa fa-home"></i> &nbsp; Home
                            </a>
                        </li>
                        <li class="nav-item">
                            <div class="btn-group">
                                <button class="btn btn-secondary-outline dropdown-toggle" type="button"
                                    id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        Kunde
                                        <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                    <li class="nav-item"><a [routerLink]="['SucheKunden']">
                                        <i class="fa fa-search"></i> &nbsp; SucheKunden</a>
                                    </li>
                                    <li class="nav-item"><a [routerLink]="['SucheKundebyBestellungId']">
                                        <i class="fa fa-search"></i> &nbsp; SucheKundebyBestellungId</a>
                                    </li>
                                    <li class="nav-item"><a [routerLink]="['DetailsKunde']">
                                        <i class="fa fa-search"></i> &nbsp; DetailsKunde</a>
                                    </li>
                                    <li class="nav-item"><a [routerLink]="['UpdateKunde']">
                                        <i class="fa fa-search"></i> &nbsp; UpdateKunde</a>
                                    </li>
                                    <li class="nav-item"><a [routerLink]="['UpdatePrivatkunde']">
                                        <i class="fa fa-search"></i> &nbsp; UpdatePrivatkunde</a>
                                    </li>
                                    <li class="nav-item"><a [routerLink]="['Balkendiagramm']">
                                        <i class="fa fa-search"></i> &nbsp; Balkendiagramm</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>

                <!-- DSL-Pfade durch @RouteConfig([{path: '/...', name: 'Home' ...} -->
            <!--
            <ul class="nav nav-pills nav-stacked">
                <li class="nav-item"><a [routerLink]="['Home']">
                    <i class="fa fa-home"></i> &nbsp; Startseite</a>
                </li>
                <li class="nav-item"><a [routerLink]="['SucheKunden']">
                    <i class="fa fa-search"></i> &nbsp; Suche</a>
                </li>
                <li class="nav-item" *ngIf="isAdmin()">
                    <a [routerLink]="['CreateKunde']">
                        <i class="fa fa-book"></i> &nbsp; Neuer Kunde
                    </a>
                </li>
                <li class="nav-item" *ngIf="isAdmin()">
                    <a [routerLink]="['Balkendiagramm']">
                        <i class="fa fa-bar-chart"></i> &nbsp; Balkendiagramm
                    </a>
                </li>
                <li class="nav-item" *ngIf="isAdmin()">
                    <a [routerLink]="['Liniendiagramm']">
                        <i class="fa fa-line-chart"></i> &nbsp; Liniendiagramm
                    </a>
                </li>
                <li class="nav-item" *ngIf="isAdmin()">
                    <a [routerLink]="['Tortendiagramm']">
                        <i class="fa fa-pie-chart"></i> &nbsp; Tortendiagramm
                    </a>
                </li>
            </ul>
            -->
        </nav>
    `,
    styleUrls: ['./app/nav.min.css'],
    // styles: ['.jz-app-nav{background-color:#BED6F8}'],
    directives: [CORE_DIRECTIVES]
    // viewProviders: [IamService]
})
export default class Nav {
    constructor() { console.log('Nav.constructor()'); }

    /**
     * Abfrage, ob ein Benutzer als Administrator eingeloggt ist.
     * @return true, falls ein Benutzer als Administrator eingeloggt
     *         ist. Sonst false.
     */
    isAdmin(): boolean { return isAdmin(); }
}
