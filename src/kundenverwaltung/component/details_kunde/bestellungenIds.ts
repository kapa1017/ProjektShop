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

import {Component, Input, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

/**
 * Komponente f&uuml;r das Tag <code>schlagwoerter</code>
 */
@Component({
    selector: 'bestellungenIds',
    directives: [CORE_DIRECTIVES],
    template: `
         <div class="list-bestellungenIds" *ngFor="#bestellungId of bestellungenIds">
            <ul class="bestellungenIds">
                <li>
                    <span>{{bestellungId}}</span>
                </li>
            </ul>
         </div>
    `
})
export default class BestellungenIds implements OnInit {
    // <schlagwoerter [values]="buch.schlagwoerter">
    // Decorator fuer ein Attribut. Hier: siehe InputMetadata in
    // node_modules\angular2\ts\src\core\metadata\directives.ts
    @Input('values') bestellungenIds: Array<string>;

    constructor() { console.log('BestellungenIds.constructor()'); }

    ngOnInit(): void {
        console.log(
            'BestellungenIds.ngOnInit(): bestellungenIds=',
            this.bestellungenIds);
    }
}
