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
import {Component, Output, EventEmitter} from 'angular2/core';
// "common" enthaelt Direktiven (z.B. ngFor, ngIf), Form Controls und Pipes
import {CORE_DIRECTIVES} from 'angular2/common';
import KundenRegistrierenService from '../../service/kunden_registrieren_service';
import {log} from '../../../shared/shared';

/**
 * Komponente f&uuml;r das Tag <code>kunden-registrieren</code>
 */
@Component({
    selector: 'kunden-registrieren',
    directives: [CORE_DIRECTIVES],
    template: `
        <div class="card">
            <div class="card-header bg-primary">
                <h4>Eingabe des Kunden Datensatzes im JSON-Format</h4>
            </div>
            <div class="card-block">
                <form action="textarea.html" method="post">
                    <div>
                        <label for="text">Anmerkung</label>
                            <textarea id="text" name="text" placeholder="JSON-Datensatz" cols="35" rows="4"></textarea>
                            <input type="submit" value="Senden" />
                    </div>
                </form>
            </div>
        </div>
    `
})
export default class KundenRegistrieren {
    nachname: string = null;
    seit: string = null;
    geschlecht: string = null;

    // Event Binding: <kunden-registrieren (waiting)="...">
    // siehe OutputMetadata in
    // node_modules\angular2\ts\src\core\metadata\directives.ts
    @Output() waiting: EventEmitter<boolean> = new EventEmitter<boolean>();

    // Empfehlung: Konstruktor nur fuer DI
    constructor(private _KundenRegistrierenService: KundenRegistrierenService) {
        console.log('KundenRegistrieren.constructor()');
    }

    /**
     * Suche nach B&uuml;chern, die den spezfizierten KundenRegistrieren entsprechen
     * @param KundenRegistrieren: KundenRegistrieren vom Typ IBuchForm
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    find(): boolean {
        const KundenRegistrieren: any = {
            nachname: this.nachname,
            seit: this.seit,
            geschlecht: this.geschlecht
        };
        console.log('KundenRegistrieren=', KundenRegistrieren);

        this.waiting.emit(true);
        this._KundenRegistrierenService.find(KundenRegistrieren);

        // Inspektion der Komponente mit dem Tag-Namen "app" im Debugger
        // Voraussetzung: globale Variable ng deklarieren (s.o.)
        // const app: any = document.querySelector('app');
        // global.ng.probe(app);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite.
        return false;
    }

    toString(): String { return 'KundenRegistrieren'; }
}
