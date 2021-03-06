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

// "core" enthaelt Funktionalitaet, damit die Webanwendung im Browser laeuft
import {Component, Input} from 'angular2/core';
// "common" enthaelt Direktiven (z.B. ngFor, ngIf), Form Controls und Pipes
import {CORE_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';

import KundenService from '../../service/kunden_service';
import Kunde from '../../model/kunde';
import APP_ROUTES from '../../../app/routes';
import {log} from '../../../shared/shared';

/**
 * Komponente f&uuml;r das Tag <code>gefundene-kunden</code>
 */
@Component({
    selector: 'gefundene-kunden',
    directives: [CORE_DIRECTIVES],
    template: `
        <!-- Template Binding durch die Direktive ngIf -->
        <!-- Eine Direktive ist eine Komponente ohne View -->
        <div class="card" *ngIf="kunden != null">
            <div class="card-header">
                <h4><i class="fa fa-folder-open-o"></i> Gefundene Kunden</h4>
            </div>
            <div class="card-block">
                <table class="table table-striped table-hover table-responsive">
                    <thead>
                        <th>Nr.</th>
                        <th>KundenId</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Umsatz</th>
                        <th>
                            <span class="sr-only">
                                Spalte f&uuml;r Details
                            </span>
                        </th>
                        <th>
                            <span class="sr-only">
                                Spalte f&uuml;r Entfernen
                            </span>
                        </th>
                    </thead>
                    <tbody>
                        <!-- Template Binding: ngFor -->
                        <!-- Event-Binding: statt (click) auch on-click -->
                        <tr *ngFor="#k of kunden; #i = index" (click)="details(k)">
                            <td>{{i + 1}}</td>
                            <td>{{k.id}}</td>
                            <td>{{k.identity.vorname}}</td>
                            <td>{{k.identity.nachname}}</td>
                            <td>{{k.umsatz}}</td>
                            <td>
                                <!-- Pfad /detailsKunde/:id, @RouteConfig in app.ts -->
                                <!-- modaler Dialog als Alternative: -->
                                <!-- http://v4-alpha.getbootstrap.com/components/modal -->
                                <a [routerLink]="['DetailsKunde', {'id': k.id}]"
                                   data-toggle="tooltip" title="Details anzeigen">
                                    <i class="fa fa-search-plus"></i>
                                </a>
                            </td>
                            <td>
                                <a (click)="remove(k)" data-toggle="tooltip"
                                   title="Entfernen">
                                    <i class="fa fa-remove"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Ausgabe des JSON-Datensatzes im Webbrowser statt console.log(...) -->
        <!--
        <pre *ngIf="kunden != null">{{kunden | json}}</pre>
        -->
    `
})
export default class GefundeneKunden {
    // Property Binding: <gefundene-buecher [buecher]="...">
    // Decorator fuer ein Attribut. Hier: siehe InputMetadata in
    // node_modules\angular2\ts\src\core\metadata\directives.ts
    @Input() kunden: Array<Kunde>;

    constructor(
        private _kundenService: KundenService, private _router: Router) {
        console.log('GefundeneKunden.constructor()');
    }

    /**
     * Das ausgew&auml;hlte bzw. angeklickte Kunde in der Detailsseite anzeigen.
     * @param kunde Das ausgew&auml;hlte Kunde
     */
    @log
    details(kunde: Kunde): void {
        console.log(`detailsKundeDef.name=${APP_ROUTES.detailsKundeDef.name}`);
        console.log(`id=${kunde.id}`);
        this._router.navigate(
            [APP_ROUTES.detailsKundeDef.name, {id: kunde.id}]);
    }

    /**
     * Das ausgew&auml;hlte bzw. angeklickte Kunde l&ouml;schen.
     * @param kunde Das ausgew&auml;hlte Kunde
     */
    @log
    remove(kunde: Kunde): void {
        const errorFn: (status: number) => void = (status: number): void => {
            console.error(`Fehler beim Loeschen: status=${status}`);
        };
        this._kundenService.remove(kunde, null, errorFn);
        this.kunden = this.kunden.filter((k: Kunde) => k.id !== kunde.id);
    }

    toString(): String { return 'GefundeneKunden'; }
}
