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
System.register(['angular2/core', 'angular2/common', '../iam/iam'], function(exports_1, context_1) {
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
    var core_1, common_1, iam_1;
    var Nav;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (iam_1_1) {
                iam_1 = iam_1_1;
            }],
        execute: function() {
            /**
             * Komponente f&uuml;r die Navigationsleiste mit dem Tag &lt;app-nav&gt;.
             */
            Nav = (function () {
                function Nav() {
                    console.log('Nav.constructor()');
                }
                /**
                 * Abfrage, ob ein Benutzer als Administrator eingeloggt ist.
                 * @return true, falls ein Benutzer als Administrator eingeloggt
                 *         ist. Sonst false.
                 */
                Nav.prototype.isAdmin = function () { return iam_1.isAdmin(); };
                Nav = __decorate([
                    core_1.Component({
                        selector: 'app-nav',
                        // Internationalisierung durch z.B. https://github.com/ocombe/ng2-translate
                        template: "\n        <nav class=\"navbar navbar-dark bg-inverse\" >\n            <!-- http://v4-alpha.getbootstrap.com/components/list-group/#linked-items -->\n            <!-- Alternative CSS-Klassen fuer list-group: navs, nav-item, nav-link -->\n            <!-- http://v4-alpha.getbootstrap.com/components/navs -->\n                <div class=\"navbar-header\">\n                    <a class=\"navbar-brand\" href=\"#\">NavBar</a>\n                </div>\n                    <ul class=\"nav navbar-nav\" >\n                        <li class=\"nav-item\">\n                            <a class=\"nav-link\" [routerLink]=\"['Home']\">\n                                <i class=\"fa fa-home\"></i> &nbsp; Home\n                            </a>\n                        </li>\n                        <li class=\"nav-item\">\n                            <div class=\"dropdown\">\n                                <button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">\n                                    Kunde\n                                    <span class=\"caret\"></span>\n                                </button>\n                                <ul class=\"dropdown-menu\" role = \"menu\" aria-labelledby=\"menu1\">\n                                    <li><a [routerLink]=\"['SucheKunden']\"> &nbsp; SucheKunden</a></li>\n                                    <li><a [routerLink]=\"['SucheKundebyBestellungId']\"> &nbsp; SucheKundebyBestellungId</a></li>\n                                    <li><a [routerLink]=\"['DetailsKunde']\"> &nbsp; DetailsKunde</a></li>\n                                    <li><a [routerLink]=\"['UpdateKunde']\"> &nbsp; UpdateKunde</a></li>\n                                    <li><a [routerLink]=\"['UpdatePrivatkunde']\"> &nbsp; UpdatePrivatkunde</a></li>\n                                    <li><a [routerLink]=\"['Balkendiagramm']\"> &nbsp; Balkendiagramm</a></li>\n                                    <li><a [routerLink]=\"['Liniendiagramm']\"> &nbsp; Liniendiagramm</a></li>\n                                    <li><a [routerLink]=\"['Tortendiagramm']\"> &nbsp; Tortendiagramm</a></li>\n                                    <li><a [routerLink]=\"['CreateMultimedia']\"> &nbsp; CreateMultimedia</a></li>\n                                    <li><a [routerLink]=\"['sucheMultimedia']\"> &nbsp; sucheMultimedia</a></li>\n                                </ul>\n                            </div>\n                        </li>\n                    </ul>\n\n                <!-- DSL-Pfade durch @RouteConfig([{path: '/...', name: 'Home' ...} -->\n            <!--\n            <ul class=\"nav nav-pills nav-stacked\">\n                <li class=\"nav-item\"><a [routerLink]=\"['Home']\">\n                    <i class=\"fa fa-home\"></i> &nbsp; Startseite</a>\n                </li>\n                <li class=\"nav-item\"><a [routerLink]=\"['SucheKunden']\">\n                    <i class=\"fa fa-search\"></i> &nbsp; Suche</a>\n                </li>\n                <li class=\"nav-item\" *ngIf=\"isAdmin()\">\n                    <a [routerLink]=\"['CreateKunde']\">\n                        <i class=\"fa fa-book\"></i> &nbsp; Neuer Kunde\n                    </a>\n                </li>\n                <li class=\"nav-item\" *ngIf=\"isAdmin()\">\n                    <a [routerLink]=\"['Balkendiagramm']\">\n                        <i class=\"fa fa-bar-chart\"></i> &nbsp; Balkendiagramm\n                    </a>\n                </li>\n                <li class=\"nav-item\" *ngIf=\"isAdmin()\">\n                    <a [routerLink]=\"['Liniendiagramm']\">\n                        <i class=\"fa fa-line-chart\"></i> &nbsp; Liniendiagramm\n                    </a>\n                </li>\n                <li class=\"nav-item\" *ngIf=\"isAdmin()\">\n                    <a [routerLink]=\"['Tortendiagramm']\">\n                        <i class=\"fa fa-pie-chart\"></i> &nbsp; Tortendiagramm\n                    </a>\n                </li>\n            </ul>\n            -->\n        </nav>\n    ",
                        styleUrls: ['./app/nav.min.css'],
                        // styles: ['.jz-app-nav{background-color:#BED6F8}'],
                        directives: [common_1.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], Nav);
                return Nav;
            }());
            exports_1("default", Nav);
        }
    }
});
//# sourceMappingURL=nav.js.map