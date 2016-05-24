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

import {Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {RouteParams, CanActivate} from 'angular2/router';

import ArtikelsService from '../../service/artikels_service';
import Artikel from '../../model/artikel';
import Stammdaten from './stammdaten';
import Schlagwoerter from './schlagwoerter';
import {isAdmin} from '../../../iam/iam';
import {isString, ErrorMessage} from '../../../shared/shared';

/**
 * Komponente f&uuml;r das Tag <code>update-artikel</code> mit Kindkomponenten
 * f&uuml;r die folgenden Tags:
 * <ul>
 *  <li> <code>stammdaten</code>
 *  <li> <code>schlagwoerter</code>
 * </ul>
 */
@Component({
    selector: 'update-artikel',
    directives: [CORE_DIRECTIVES, Stammdaten, Schlagwoerter, ErrorMessage],
    template: `
        <section *ngIf="artikel !== null">
            <h4>Artikel {{artikel._id}}:</h4>

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#stammdaten"
                       data-toggle="tab">
                        Stammdaten
                    </a>
                </li>
                <li class="nav-item" *ngIf="artikel.schlagwoerter.length !== 0">
                    <a class="nav-link" href="#schlagwoerter"
                       data-toggle="tab">
                        Schlagw&ouml;rter
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten">
                    <div class="m-t-1">
                        <stammdaten [artikel]="artikel"></stammdaten>
                    </div>
                </div>
                <div class="tab-pane fade" id="schlagwoerter">
                    <div class="m-t-1">
                        <schlagwoerter [artikel]="artikel"></schlagwoerter>
                    </div>
                </div>
            </div>
        </section>

        <error-message [text]="errorMsg"></error-message>
    `
})
// Die Komponente kann nur aktiviert bzw. benutzt werden, wenn die aufgerufene
// Function true liefert
@CanActivate(isAdmin)
export default class UpdateArtikel implements OnInit {
    artikel: Artikel = null;
    errorMsg: string = null;

    constructor(
        private _artikelsService: ArtikelsService,
        private _routeParams: RouteParams) {
        console.log('UpdateArtikel.constructor(): routeParams=', _routeParams);
    }

    /**
     * Die Beobachtung starten, ob es ein zu aktualisierendes Artikel oder einen
     * Fehler gibt.
     */
    ngOnInit(): void {
        this._observeArtikel();
        this._observeError();

        // Pfad-Parameter aus /updateArtikel/:id
        const id: string = this._routeParams.params['id'];
        console.log(`UpdateArtikel.ngOnInit(): id=${id}`);
        this._artikelsService.findById(id);
    }

    /**
     * Beobachten, ob es ein zu aktualisierendes Artikel gibt.
     */
    /* tslint:disable:align */
    private _observeArtikel(): void {
        this._artikelsService.observeArtikel((artikel: Artikel) => {
            this.artikel = artikel;
            console.log('UpdateArtikel.artikel=', this.artikel);
        }, this);
    }

    /**
     * Beobachten, ob es einen Fehler gibt.
     */
    private _observeError(): void {
        this._artikelsService.observeError((err: string | number) => {
            if (err === null) {
                this.errorMsg = 'Ein Fehler ist aufgetreten.';
                return;
            }

            if (isString(err)) {
                this.errorMsg = <string>err;
                return;
            }

            switch (err) {
                case 404:
                    this.errorMsg = 'Kein Artikel vorhanden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`UpdateArtikel.errorMsg: ${this.errorMsg}`);
        }, this);
    }
    /* tslint:enable:align */
}
