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
import {Component, Input, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/common';
import {Router} from 'angular2/router';

import KundenService from '../../service/kunden_service';
import Kunde from '../../model/kunde';
import KundeValidator from '../validator/kunde_validator';
import APP_ROUTES from '../../../app/routes';
import {isBlank, log} from '../../../shared/shared';
/* tslint:enable:max-line-length */

/**
 * Komponente f&uuml;r das Tag <code>stammdaten</code>
 */
@Component({
    selector: 'stammdaten-privat',
    // FormBuilder ist nur fuer die Komponente und ihre Kind-Komponenten
    // verfuegbar
    /* tslint:disable:max-line-length */
    // http://blog.thoughtram.io/angular/2015/08/20/host-and-visibility-in-angular-2-dependency-injection.html
    /* tslint:enable:max-line-length */
    providers: [FormBuilder],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    template: `
        <form [ngFormModel]="form" role="form">
            <div class="form-group row"
                 [class.text-danger]="!nachname.valid && nachname.touched">
                <label for="nachnameInput" class="col-sm-2 form-control-label">
                    Nachname *
                </label>
                <div class="col-sm-10">
                    <input id="nachnameInput"
                        placeholder="Kundenname"
                        class="form-control"
                        autofocus
                        type="search"
                        [ngFormControl]="nachname">
                </div>
                <div class="col-sm-offset-2 col-sm-10"
                     *ngIf="!nachname.valid && nachname.touched">
                    Ein Kundenname muss mit einem Buchstaben oder einer Ziffer
                    beginnen.
                </div>
            </div>
            
            <!-- Fuer DatePicker, Rating usw. gibt es noch keine brauchbaren
                 AngularJS-Direktiven auf Basis von Bootstrap -->
 
            <div class="form-group row">
                <div class="col-sm-offset-2 col-sm-10">
                    <button class="btn btn-primary" (click)="updatePrivateKunde()"
                            [disabled]="form.pristine || !form.valid">
                        <i class="fa fa-check"></i> &nbsp; Stammdaten aktualisieren
                    </button>
                </div>
            </div>
        </form>
    `
})
export default class StammdatenPrivat implements OnInit {
    // <stammdaten [kunde]="...">
    @Input() kunde: Kunde;

    form: ControlGroup;
    nachname: Control;

    constructor(
        private _formBuilder: FormBuilder,
        private _kundenService: KundenService, private _router: Router) {
        console.log('StammdatenPrivat.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Stammdaten des zu &auml;ndernden Kunden vorbelegen.
     */
    ngOnInit(): void {
        console.log('StammdatenPrivat.ngOnInit(): kunde=', this.kunde);

        // Definition und Vorbelegung der Eingabedaten
        this.nachname =
            new Control(this.kunde.identity.nachname, KundeValidator.nachname);
        this.form = this._formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            'nachname': this.nachname
        });
    }

    /**
     * Die aktuellen Stammdaten f&uuml;r das angezeigte Kunden-Objekt
     * zur&uuml;ckschreiben.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    updatePrivateKunde(): boolean {
        if (this.form.pristine) {
            console.log(
                'StammdatenPrivat.updatePrivateKunde(): keine Aenderungen');
            return;
        }

        if (isBlank(this.kunde)) {
            console.error(
                'StammdatenPrivat.updatePrivateKunde(): kunde === null/undefined');
            return;
        }

        // rating, preis und rabatt koennen im Formular nicht geaendert werden
        this.kunde.updateStammdatenPrivat(
            this.nachname.value, this.kunde.kategorie, this.kunde.newsletter,
            this.kunde.rabatt, this.kunde.umsatz, this.kunde.agbAkzeptiert,
            this.kunde.bemerkungen, this.kunde.geschlecht);
        console.log(
            'StammdatenPrivat.updatePrivateKunde(): kunde=', this.kunde);

        const successFn: () => void = () => {
            console.log(
                /* tslint:disable:max-line-length */
                `StammdatenPrivat.updatePrivateKunde(): successFn: navigate: ${APP_ROUTES.homeDef.name}`);
            /* tslint:enable:max-line-length */
            this._router.navigate([APP_ROUTES.homeDef.name]);
        };
        this._kundenService.updatePrivateKunde(this.kunde, successFn, null);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }

    toString(): String { return 'StammdatenPrivat'; }
}
