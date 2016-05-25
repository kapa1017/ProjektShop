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
System.register(['angular2/core', 'angular2/common', '../../service/kunden_registrieren_service', '../../../shared/shared'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, kunden_registrieren_service_1, shared_1;
    var KundenRegistrieren;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (kunden_registrieren_service_1_1) {
                kunden_registrieren_service_1 = kunden_registrieren_service_1_1;
            },
            function (shared_1_1) {
                shared_1 = shared_1_1;
            }],
        execute: function() {
            /**
             * Komponente f&uuml;r das Tag <code>kunden-registrieren</code>
             */
            KundenRegistrieren = (function () {
                // Empfehlung: Konstruktor nur fuer DI
                function KundenRegistrieren(_KundenRegistrierenService) {
                    this._KundenRegistrierenService = _KundenRegistrierenService;
                    this.nachname = null;
                    this.seit = null;
                    this.geschlecht = null;
                    // Event Binding: <kunden-registrieren (waiting)="...">
                    // siehe OutputMetadata in
                    // node_modules\angular2\ts\src\core\metadata\directives.ts
                    this.waiting = new core_1.EventEmitter();
                    console.log('KundenRegistrieren.constructor()');
                }
                /**
                 * Suche nach B&uuml;chern, die den spezfizierten KundenRegistrieren entsprechen
                 * @param KundenRegistrieren: KundenRegistrieren vom Typ IBuchForm
                 * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
                 *         zu konsumieren.
                 */
                KundenRegistrieren.prototype.find = function () {
                    var KundenRegistrieren = {
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
                };
                KundenRegistrieren.prototype.toString = function () { return 'KundenRegistrieren'; };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], KundenRegistrieren.prototype, "waiting");
                __decorate([
                    shared_1.log, 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', Boolean)
                ], KundenRegistrieren.prototype, "find");
                KundenRegistrieren = __decorate([
                    core_1.Component({
                        selector: 'kunden-registrieren',
                        directives: [common_1.CORE_DIRECTIVES],
                        template: "\n        <div class=\"card\">\n            <div class=\"card-header bg-primary\">\n                <h4>Eingabe des Kunden Datensatzes im JSON-Format</h4>\n            </div>\n            <div class=\"card-block\">\n                <form action=\"textarea.html\" method=\"post\">\n                    <div>\n                        <label for=\"text\">Anmerkung</label>\n                            <textarea id=\"text\" name=\"text\" placeholder=\"JSON-Datensatz\" cols=\"35\" rows=\"4\"></textarea>\n                            <input type=\"submit\" value=\"Senden\" />\n                    </div>\n                </form>\n            </div>\n        </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof kunden_registrieren_service_1["default"] !== 'undefined' && kunden_registrieren_service_1["default"]) === 'function' && _a) || Object])
                ], KundenRegistrieren);
                return KundenRegistrieren;
                var _a;
            }());
            exports_1("default", KundenRegistrieren);
        }
    }
});
//# sourceMappingURL=kunden_registrieren.js.map