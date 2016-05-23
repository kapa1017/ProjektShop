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

/**
 * Komponente f&uuml;r das Tag <code>gefundene-bueche</code>
 */
@Component({
    selector: 'gefundenes-multimedia',
    directives: [CORE_DIRECTIVES],
    template: `
        <!-- Template Binding durch die Direktive ngIf -->
        <!-- Eine Direktive ist eine Komponente ohne View -->
        <div class="card" *ngIf="file != null">
            <div class="card-header">
                <h4><i class="fa fa-folder-open-o"></i> Gefundenes Multimedia</h4>
            </div>
            <div class="card-block" *ngIf="file.type === 'image/jpeg'|'image/pjpeg'|'image/png'">
            <img src="{{file.name}}">
            </div>
            <div class="card-block" *ngIf="file.type === 'video/mp4'">
            <video src="{{file.name}}"></video>
            </div>
            <div class="card-block" *ngIf="file.type === 'audio/wav'">
            <audio src="{{file.name}}"></audio>
            </div>
        </div>
    `
})
export default class GefundenerKunde {
    // Property Binding: <gefundene-buecher [buecher]="...">
    // Decorator fuer ein Attribut. Hier: siehe InputMetadata in
    // node_modules\angular2\ts\src\core\metadata\directives.ts
    @Input() file: File;

    constructor(
        private _kundenService: KundenService, private _router: Router) {
        console.log('GefundenesMultimedia.constructor()');
    }

    toString(): String { return 'GefundenesMultimedia'; }
}
