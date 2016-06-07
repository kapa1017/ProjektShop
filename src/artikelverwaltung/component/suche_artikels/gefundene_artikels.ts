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

import ArtikelsService from '../../service/artikels_service';
import Artikel from '../../model/artikel';
import APP_ROUTES from '../../../app/routes';
import {log} from '../../../shared/shared';

/**
 * Komponente f&uuml;r das Tag <code>gefundene-bueche</code>
 */
@Component({
    selector: 'gefundene-artikels',
    directives: [CORE_DIRECTIVES],
    template: `
        <!-- Template Binding durch die Direktive ngIf -->
        <!-- Eine Direktive ist eine Komponente ohne View -->
        <div class="card" *ngIf="artikels != null">
            <div class="card-header">
                <h4><i class="fa fa-folder-open-o"></i> Gefundene Artikel</h4>
            </div>
            <div class="card-block">
                <table class="table table-striped table-hover table-responsive">
                    <thead>
                        <th>Nr.</th>
                        <th>ArtikelsId</th>
                        <th>Bezeichnung</th>
                        <th>Rating</th>
                        <th>Preis</th>
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
                        <tr *ngFor="#a of artikels; #i = index" (click)="details(a)">
                            <td>{{i + 1}}</td>
                            <td>{{a.id}}</td>
                            <td>{{a.bezeichnung}}</td>
                            <td>{{a.rating}}</td>
                            <td>{{a.preis}}</td>
                            <td>
                                <!-- Pfad /detailsArtikel/:id, @RouteConfig in app.ts -->
                                <!-- modaler Dialog als Alternative: -->
                                <!-- http://v4-alpha.getbootstrap.com/components/modal -->
                                <a [routerLink]="['DetailsArtikel', {'id': a.id}]"
                                   data-toggle="tooltip" title="Details anzeigen">
                                    <i class="fa fa-search-plus"></i>
                                </a>
                            </td>
                            <td>
                                <a (click)="remove(a)" data-toggle="tooltip"
                                   title="Entfernen">
                                    <i class="fa fa-remove"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-footer">
                <i class="fa fa-info-circle"></i>
                Zur Anzeige der JSON-Datens&auml;tze in gefundene_artikels.ts
                den Kommentar beim Tag &lt;pre&gt; entfernen
            </div>
        </div>

        <!-- Ausgabe des JSON-Datensatzes im Webbrowser statt console.log(...) -->
        <!--
        <pre *ngIf="artikels != null">{{artikels | json}}</pre>
        -->
    `
})
export default class GefundeneArtikels {
    // Property Binding: <gefundene-buecher [buecher]="...">
    // Decorator fuer ein Attribut. Hier: siehe InputMetadata in
    // node_modules\angular2\ts\src\core\metadata\directives.ts
    @Input() artikels: Array<Artikel>;

    constructor(
        private _artikelsService: ArtikelsService, private _router: Router) {
        console.log('GefundeneArtikels.constructor()');
    }

    /**
     * Das ausgew&auml;hlte bzw. angeklickte Buch in der Detailsseite anzeigen.
     * @param buch Das ausgew&auml;hlte Buch
     */
    @log
    details(artikel: Artikel): void {
        console.log(
            `detailsArtikelDef.name=${APP_ROUTES.detailsArtikelDef.name}`);
        console.log(`id=${artikel.id}`);
        this._router.navigate(
            [APP_ROUTES.detailsArtikelDef.name, {id: artikel.id}]);
    }

    /**
     * Das ausgew&auml;hlte bzw. angeklickte Buch l&ouml;schen.
     * @param buch Das ausgew&auml;hlte Buch
     */
    @log
    remove(artikel: Artikel): void {
        const errorFn: (status: number) => void = (status: number): void => {
            console.error(`Fehler beim Loeschen: status=${status}`);
        };
        this._artikelsService.remove(artikel, null, errorFn);
        this.artikels =
            this.artikels.filter((k: Artikel) => k.id !== artikel.id);
    }

    toString(): String { return 'GefundeneArtikels'; }
}
