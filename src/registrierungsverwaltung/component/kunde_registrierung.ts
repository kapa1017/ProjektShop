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
/* tslint:disable:max-line-length */
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/common';
import {Component, OnInit} from 'angular2/core';
import {Router, CanActivate} from 'angular2/router';
import KundeRegistrierungService from '../service/kundeRegistrierung_service';
import Kunde from '../../kundenverwaltung/model/kunde';
import KundeValidator from '../../kundenverwaltung/component/validator/kunde_validator';
import APP_ROUTES from '../../app/routes';
import {isAdmin} from '../../iam/iam';
import {isPresent, log} from '../../shared/shared';
/* tslint:enable:max-line-length */

/**
 * Komponente mit dem Tag &lt;kunde-registrierung&gt;, um das Erfassungsformular
 * f&uuml;r ein neuer Kunde zu realisieren.
 */
@Component({
    selector: 'kunde-registrierung',

    // FormBuilder ist nur fuer die Komponente und ihre Kind-Komponenten
    // verfuegbar
    /* tslint:disable:max-line-length */
    // http://blog.thoughtram.io/angular/2015/08/20/host-and-visibility-in-angular-2-dependency-injection.html
    /* tslint:enable:max-line-length */
    providers: [FormBuilder],

    // Verwendung der Direktiven ngFormModel und ngFormControl
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],

    // Keine Zerlegung in Subkomponenten, weil das Control-Objekt der
    // Subkomponente im Konstruktor fuer die ControlGroup benoetigt wird
    templateUrl: '/registrierungsverwaltung/component/kunde_registrierung.html'

    // FIXME Relative URL https://github.com/angular/angular/issues/2383
    //       erfordert TypeScript 1.8 wg. Moment und CommonJS
    // templateUrl: 'create_buch.html',
    // moduleId: module.id,
})
// Die Komponente kann nur aktiviert bzw. benutzt werden, wenn die aufgerufene
// Function true liefert
// https://github.com/angular/angular/issues/2965
// https://github.com/angular/angular/issues/4112
@CanActivate(isAdmin)
export default class KundeRegistrierung implements OnInit {
    form: ControlGroup;
    // Keine Vorbelegung bzw. der leere String, da es Placeholder gibt
    nachname: Control = new Control('', KundeValidator.nachname);
    vorname: Control = new Control('');
    email: Control = new Control('');
    password: Control = new Control('');
    passwordWdh: Control = new Control('');
    kategorie: Control = new Control('');
    // Varianten fuer Validierung:
    //    serverseitig mittels Request/Response
    //    clientseitig bei den Ereignissen keyup, change, ...
    // Ein Endbenutzer bewirkt staendig einen neuen Fehlerstatus
    rabatt: Control = new Control('');
    umsatz: Control = new Control('0');
    newsletter: Control = new Control('');
    agbAkzeptiert: Control = new Control('');
    bemerkungen: Control = new Control('');

    constructor(
        private _formBuilder: FormBuilder,
        private _kundeRegistrierungService: KundeRegistrierungService,
        private _router: Router) {
        console.log('KundeRegistrierung.constructor()');
        if (!isPresent(_router)) {
            console.error('Injizierter Router:', _router);
        }
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren.
     */
    ngOnInit(): void {
        this.form = this._formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            'nachname': this.nachname,
            'vorname': this.vorname,
            'email': this.email,
            'password': this.password,
            'passwordWdh': this.passwordWdh,
            'kategorie': this.kategorie,
            'rabatt': this.rabatt,
            'umsatz': this.umsatz,
            'newsletter': this.newsletter,
            'agbAkzeptiert': this.agbAkzeptiert,
            'bemerkungen': this.bemerkungen,
        });
    }

    /**
     * Die Methode <code>save</code> realisiert den Event-Handler, wenn das
     * Formular abgeschickt wird, um ein neuer Kunde anzulegen.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    save(): boolean {
        // In einem Control oder in einer ControlGroup gibt es u.a. folgende
        // Properties
        //    value     JSON-Objekt mit den IDs aus der ControlGroup als
        //              Schluessel und den zugehoerigen Werten
        //    errors    Map<string,any> mit den Fehlern, z.B. {'required': true}
        //    valid     true/false
        //    dirty     true/false, falls der Wert geaendert wurde

        if (!this.form.valid) {
            /* tslint:disable:max-line-length */
            console.log(
                `valid=${this.nachname.valid}, errorRequired=${this.nachname.errors['required']}`);
            /* tslint:enable:max-line-length */
            return false;
        }

        const neuerKunde: Kunde = Kunde.fromForm(this.form.value);
        console.log('neuerKunde=', neuerKunde);

        const successFn: (
            location: string) => void = (location: string = null) => {
            console.log(
                `KundeRegistrierung.save(): successFn(): location: ${location}`);
            // TODO Das Response-Objekt enthaelt im Header NICHT "Location"
            console.log(
                /* tslint:disable:max-line-length */
                `KundeRegistrierung.save(): successFn(): navigate: ${APP_ROUTES.homeDef.name}`);
            /* tslint:enable:max-line-length */
            this._router.navigate([APP_ROUTES.homeDef.name]);
        };
        const errorFn: (status: number, text: string) => void =
            (status: number, text: string = null): void => {
                console.log(
                    `KundeRegistrierung.save(): errorFn(): status: ${status}`);
                if (isPresent(text)) {
                    console.log(
                        `KundeRegistrierung.save(): errorFn(): text: ${text}`);
                }
            };
        this._kundeRegistrierungService.save(neuerKunde, successFn, errorFn);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum Refresh
        // der gesamten Seite
        return false;
    }

    toString(): String { return 'KundeRegistrierung'; }
}
