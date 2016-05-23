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

import Kunde from '../../model/kunde';

/**
 * Komponente f&uuml;r das Tag <code>stammdaten</code>
 */
@Component({
    selector: 'stammdaten',
    directives: [CORE_DIRECTIVES],
    // siehe @Input in der Komponenten-Klasse
    // inputs: ['buch'],
    template: `
        <table class="table table-stripped table-hover table-responsive">
            <tbody>
                <tr>
                    <td><label>Typ</label></td>
                    <td>
                        <span [ngSwitch]="kunde.typ">
                            <span *ngSwitchWhen="'P'">Privatkunde</span>
                            <span *ngSwitchWhen="'F'">Firmenkunde</span>
                            <span *ngSwitchDefault>unbekannt</span>
                        </span>
                     </td>
                </tr>
                <tr>
                    <td><label>Nachname</label></td>
                    <td>{{kunde.identity.nachname}}</td>
                </tr>
                 <tr>
                    <td><label>Vorname</label></td>
                    <td>{{kunde.identity.vorname}}</td>
                </tr>
                <tr>
                    <td><label>Kategorie</label></td>
                    <td>
                        <span *ngFor="#r of kunde.kategorieArray">
                            <i class="fa fa-star" style="color: yellow;"
                               *ngIf="r === true"></i>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><label>Rabatt</label></td>
                    <!-- {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits} -->
                    <!-- default: 1.0-3 -->
                    <!-- node_modules\angular2\ts\src\...\number_pipe.ts -->
                    <td>{{kunde.rabatt | percent: '.2'}}</td>
                </tr>
                <tr>
                    <td><label>Umsatz</label></td>
                    <!-- TODO 2 Nachkommastellen. Pipe "| number: '.2'" -->
                    <td>{{kunde.umsatz | currency: 'EUR': true}}</td>
                </tr>
                <tr>
                    <td><label>seit</label></td>
                    <td>
                        {{kunde.datumFormatted}}<br/>
                        {{kunde.datumFromNow}}
                    </td>
                </tr>
                <tr>
                    <td><label>Newsletter?</label></td>
                    <td>
                        <input type="checkbox" checked="{{kunde.newsletter}}"
                            disabled class="checkbox">
                    </td>
                </tr>
                <tr>
                    <td><label>Agbakzeptiert?</label></td>
                    <td>
                        <input type="checkbox" checked="{{kunde.agbAkzeptiert}}"
                            disabled class="checkbox">
                    </td>
                </tr>
                <tr>
                    <td><label>Bemerkungen</label></td>
                    <td>{{kunde.bemerkungen}}</td>
                </tr>
                <tr>
                    <td><label>Geschlecht</label></td>
                    <td>
                        <span [ngSwitch]="kunde.geschlecht">
                            <span *ngSwitchWhen="'MAENNLICH'">männlich</span>
                            <span *ngSwitchWhen="'WEIBLICH'">weiblich</span>
                            <span *ngSwitchDefault>unbekannt</span>
                        </span>
                    </td>
                </tr>
                 <tr>
                    <td><label>Familienstand</label></td>
                    <td>
                        <span [ngSwitch]="kunde.familienstand">
                            <span *ngSwitchWhen="'VERHEIRATET'">VERHEIRATET</span>
                            <span *ngSwitchWhen="'LEDIG'">LEDIG</span>
                            <span *ngSwitchWhen="'GESCHIEDEN'">GESCHIEDEN</span>
                            <span *ngSwitchWhen="'VERWITWET'">VERWITWET</span>
                            <span *ngSwitchDefault>unbekannt</span>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export default class Stammdaten implements OnInit {
    // Property Binding: <stammdaten [buch]="...">
    // Decorator fuer ein Attribut. Hier: siehe InputMetadata in
    // node_modules\angular2\ts\src\core\metadata\directives.ts
    @Input() kunde: Kunde;

    constructor() { console.log('Stammdaten.constructor()'); }

    ngOnInit(): void {
        console.log('Stammdaten.ngOnInit(): kunde=', this.kunde);
    }
}
