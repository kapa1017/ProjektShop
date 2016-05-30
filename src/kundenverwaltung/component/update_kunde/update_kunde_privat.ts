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

import KundenService from '../../service/kunden_service';
import Kunde from '../../model/kunde';
import Stammdaten from './stammdaten';
import Stammdaten_Privat from './stammdaten_privat';
import {isAdmin} from '../../../iam/iam';
import {isString, ErrorMessage} from '../../../shared/shared';

/**
 * Komponente f&uuml;r das Tag <code>update-kunde-privat</code> mit
 * Kindkomponenten
 * f&uuml;r die folgenden Tags:
 * <ul>
 *  <li> <code>stammdaten</code>
 *  <li> <code>schlagwoerter</code>
 * </ul>
 */
@Component({
    selector: 'update-kunde-privat',
    directives: [CORE_DIRECTIVES, Stammdaten, Stammdaten_Privat, ErrorMessage],
    template: `
        <section *ngIf="kunde !== null">
            <h4>Kunde {{kunde._id}}:</h4>
           
            <ul class="nav nav-tabs">              
                <li class="nav-item">
                    <a class="nav-link active" href="#stammdaten-privat"
                    data-toggle="tab">
                        Stammdaten
                    </a>
                </li>
            </ul>
            
             <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten-privat">
                    <div class="m-t-1">
                        <stammdaten-privat [kunde]="kunde"></stammdaten-privat>
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
export default class UpdatePrivatkunde implements OnInit {
    kunde: Kunde = null;
    errorMsg: string = null;

    constructor(
        private _kundeService: KundenService,
        private _routeParams: RouteParams) {
        console.log(
            'UpdatePrivatkunde.constructor(): routeParams=', _routeParams);
    }

    /**
     * Die Beobachtung starten, ob es ein zu aktualisierendes Kunden oder einen
     * Fehler gibt.
     */
    ngOnInit(): void {
        this._observeKunde();
        this._observeError();

        // Pfad-Parameter aus /updatePrivatkunde/:id
        const id: string = this._routeParams.params['id'];
        console.log(`UpdatePrivatkunde.ngOnInit(): kundeId=${id}`);
        this._kundeService.findById(id);
    }

    /**
     * Beobachten, ob es ein zu aktualisierendes Kunde gibt.
     */
    /* tslint:disable:align */
    private _observeKunde(): void {
        this._kundeService.observeKunde((kunde: Kunde) => {
            this.kunde = kunde;
            console.log('UpdatePrivatekunde.kunde=', this.kunde);
        }, this);
    }

    /**
     * Beobachten, ob es einen Fehler gibt.
     */
    private _observeError(): void {
        this._kundeService.observeError((err: string | number) => {
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
                    this.errorMsg = 'Kein Kunde vorhanden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`UpdateKunde.errorMsg: ${this.errorMsg}`);
        }, this);
    }
    /* tslint:enable:align */
}
