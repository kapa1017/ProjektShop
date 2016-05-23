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

import {IKundeServer} from '../../model/kunde';

/**
 * Array f&uuml;r das Mocking von B&uuml;chern
 */
const KUNDEN: Array<IKundeServer> = [
    {
      id: '000000000000000000000001',
      typ: 'P',
      identity: {
          loginname: 'admin',
          enabled: true,
          nachname: 'Admin',
          email: 'admin@hs-karlsruhe.de',
          adresse: {
              plz: '76133',
              ort: 'Karlsruhe',
              strasse: 'Moltkeweg',
              hausnr: '73'
          }
      },
      kategorie: 5,
      rabatt: 0.011,
      umsatz: 2.4,
      seit: '2014-02-05',
      newsletter: true,
      agbAkzeptiert: true,
      bemerkungen: 'Hallo!',
      bestellungenUri:
          'http://localhost:8443/shop/rest/bestellungen/kunde/00000001-0000-0000-0000-000000000000',
      geschlecht: 'MAENNLICH',
      familienstand: 'VERHEIRATET',
      hobbys: ['SPORT', 'LESEN']
    },
    {
      id: '000000000000000000000002',
      typ: 'F',
      identity: {
          loginname: 'adriana.alpha',
          enabled: true,
          nachname: 'Alpha',
          vorname: 'Adriana',
          email: 'adriana.alpha@hs-karlsruhe.de',
          adresse: {
              plz: '76133',
              ort: 'Karlsruhe',
              strasse: 'Moltkeweg',
              hausnr: '36'
          }
      },
      kategorie: 4,
      rabatt: 0.011,
      umsatz: 11.2,
      seit: '2014-02-04',
      newsletter: true,
      agbAkzeptiert: true,
      bemerkungen: 'Hallo!',
      bestellungenUri:
          'http://localhost:8443/shop/rest/bestellungen/kunde/00000001-0000-0000-0000-000000000001',
    },
    {
      id: '000000000000000000000003',
      typ: 'F',
      identity: {
          loginname: 'anton.alpha',
          enabled: true,
          nachname: 'Alpha',
          vorname: 'Anton',
          email: 'anton.alpha@hs-karlsruhe.de',
          adresse: {
              plz: '76133',
              ort: 'Karlsruhe',
              strasse: 'Moltkeweg',
              hausnr: '59'
          }
      },
      kategorie: 3,
      rabatt: 0.011,
      umsatz: 7.8,
      seit: '2014-02-05',
      newsletter: true,
      agbAkzeptiert: true,
      bemerkungen: 'Hallo!',
      bestellungenUri:
          'http://localhost:8443/shop/rest/bestellungen/kunde/00000001-0000-0000-0000-000000000003'
    },
    {
      id: '000000000000000000000004',
      typ: 'P',
      identity: {
          loginname: 'alfred.alpha',
          enabled: true,
          nachname: 'Alpha',
          vorname: 'Alfred',
          email: 'alfred.alpha@hs-karlsruhe.de',
          adresse: {
              plz: '76133',
              ort: 'Karlsruhe',
              strasse: 'Moltkeweg',
              hausnr: '41'
          }
      },
      kategorie: 4,
      rabatt: 0.022,
      umsatz: 15.9,
      seit: '2014-02-05',
      newsletter: true,
      agbAkzeptiert: true,
      bemerkungen: 'Hallo!',
      bestellungenUri:
          'http://localhost:8443/shop/rest/bestellungen/kunde/00000001-0000-0000-0000-000000000002',
      geschlecht: 'MAENNLICH',
      familienstand: 'GESCHIEDEN',
      hobbys: ['LESEN', 'REISEN']
    },
    {
      id: '000000000000000000000005',
      typ: 'P',
      identity: {
          loginname: 'nl.nu',
          enabled: true,
          nachname: 'Nu',
          vorname: 'Nl',
          email: 'nl.nu@hs-karlsruhe.de',
          adresse: {
              plz: '76133',
              ort: 'Karlsruhe',
              strasse: 'Moltkeweg',
              hausnr: '89'
          }
      },
      kategorie: 4,
      rabatt: 0.011,
      umsatz: 19.6,
      seit: '2014-02-05',
      newsletter: true,
      agbAkzeptiert: true,
      bemerkungen: 'Hallo!',
      bestellungenUri:
          'http://localhost:8443/shop/rest/bestellungen/kunde/00000001-0000-0000-0000-000000000031',
      geschlecht: 'WEIBLICH',
      familienstand: 'LEDIG',
      hobbys: ['SPORT', 'LESEN', 'REISEN']
    }
];

export default KUNDEN;
