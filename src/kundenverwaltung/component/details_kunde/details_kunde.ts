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
import {RouteParams} from 'angular2/router';

import KundenService from '../../service/kunden_service';
import Kunde from '../../model/kunde';
import Stammdaten from './stammdaten';
import Hobbys from './hobbys';
// import BestellungenIds from './bestellungenIds';
import {isAdmin} from '../../../iam/iam';
import {isString, Waiting, ErrorMessage} from '../../../shared/shared';

/**
 * Komponente f&uuml;r das Tag <code>details-buch</code>
 */
@Component({
    selector: 'details-kunde',
    directives: [CORE_DIRECTIVES, Stammdaten, Hobbys, Waiting, ErrorMessage],
    template: `
        <waiting [activated]="waiting"></waiting>

        <section *ngIf="kunde !== null">
            <h4>Kunde {{kunde.id}}:</h4>

        <!-- http://v4-alpha.getbootstrap.com/components/navs/#tabs -->
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#stammdaten"
                       data-toggle="tab">
                        Stammdaten
                    </a>
                </li>
                <li class="nav-item" *ngIf="kunde.hasHobbys()">
                    <a class="nav-link" href="#hobbys"
                       data-toggle="tab">
                        Hobbys
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten">
                    <div class="m-t-1">
                        <stammdaten [kunde]="kunde"></stammdaten>
                    </div>
                </div>
                <div class="tab-pane fade" id="hobbys"
                    *ngIf="kunde.hasHobbys()">
                    <div class="m-t-1">
                        <hobbys [values]="kunde.hobbys">
                        </hobbys>
                    </div>
                </div>
            </div>
            
            <div *ngIf="!kunde.isPrivat()">
                &nbsp;
                <a [routerLink]="['UpdateKunde', {'id': kunde.id}]"
                   data-toggle="tooltip" title="Bearbeiten"
                   *ngIf="isAdmin()">
                   <i class="fa fa-2x fa-edit"></i>
               </a>
            </div>
            <div *ngIf="kunde.isPrivat()">
                &nbsp;
                <a [routerLink]="['UpdatePrivatkunde', {'id': kunde.id}]"
                   data-toggle="tooltip" title="Bearbeiten"
                   *ngIf="isAdmin()">
                   <i class="fa fa-2x fa-edit"></i>
                </a>
            </div>
        </section>
       
        <error-message [text]="errorMsg"></error-message>
    `
})
export default class DetailsKunde implements OnInit {
    waiting: boolean = false;
    kunde: Kunde = null;
    errorMsg: string = null;

    constructor(
        private _kundenService: KundenService,
        private _routeParams: RouteParams) {
        console.log('DetailsKunde.constructor(): routeParams=', _routeParams);
    }

    // Methode zum "LifeCycle Hook" OnInit: wird direkt nach dem Konstruktor
    // aufgerufen: node_modules\angular2\ts\src\core\linker\interfaces.ts
    ngOnInit(): void {
        this._observeKunde();
        this._observeError();

        // Pfad-Parameter aus /detailsBuch/:_id
        const id: string = this._routeParams.params['id'];
        console.log(`DetailsKunde.ngOnInit(): id= ${id}`);
        this._kundenService.findById(id);
    }

    isAdmin(): boolean { return isAdmin(); }

    /* tslint:disable:align */
    private _observeKunde(): void {
        this._kundenService.observeKunde((kunde: Kunde) => {
            this.waiting = false;
            this.kunde = kunde;
            console.log('DetailsKunde.kunde=', this.kunde);
        }, this);
    }

    private _observeError(): void {
        this._kundenService.observeError((err: string | number) => {
            this.waiting = false;
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
                    this.errorMsg = 'Kein Kunde gefunden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`DetailsKunde.errorMsg: ${this.errorMsg}`);
        }, this);
    }
    /* tslint:enable:align */
}
