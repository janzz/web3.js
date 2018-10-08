/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var ProvidersPackage = require('web3-core-providers');
var EthPackage = require('web3-eth');
var PersonalPackage = require('web3-eth-personal');
var Utils = require('web3-utils');
var ShhPackage = require('web3-shh');
var BzzPackage = require('web3-bzz');
var NetworkPackage = require('web3-net');
var version = require('../package.json').version;

/**
 * @param {any} provider
 * @param {Net} net
 *
 * @constructor
 */
var Web3 = function Web3(provider, net) {
    this.version = version;

    if (typeof provider === 'undefined') {
        throw new Error('No provider given as constructor parameter!');
    }

    var currentProvider = ProvidersPackage.resolve(provider, net);

    if (!currentProvider) {
        throw new Error('Invalid provider given as constructor parameter!');
    }

    this.utils = Utils;
    this.eth = EthPackage.createEth(provider);
    this.shh = ShhPackage.createShh(provider);
    this.bzz = BzzPackage.createBzz(provider);

    /**
     * Defines accessors for the currentProvider property
     */
    Object.defineProperty(this, 'currentProvider', {
        get: function () {
            return currentProvider;
        },
        set: function (provider) {
            if (typeof currentProvider.clearSubscriptions !== 'undefined') {
                currentProvider.clearSubscriptions();
            }

            currentProvider = ProvidersPackage.resolve(provider);
            this.eth.setProvider(provider);
            this.shh.setProvider(provider);
            this.bzz.setProvider(provider);
        },
        enumerable: true
    });
};

Web3.givenProvider = ProvidersPackage.detect();

Web3.version = version;

Web3.utils = Utils;

Web3.modules = {
    Eth: function (provider, net) {
        return EthPackage.createEth(ProvidersPackage.resolve(provider, net));
    },
    Net: function (provider, net) {
        return NetworkPackage.createNetwork(ProvidersPackage.resolve(provider, net));
    },
    Personal: function (provider, net) {
        return PersonalPackage.createPersonal(ProvidersPackage.resolve(provider, net));
    },
    Shh: function (provider, net) {
        return ShhPackage.createShh(ProvidersPackage.resolve(provider, net));
    },
    Bzz: function (provider, net) {
        return new BzzPackage.createBzz(ProvidersPackage.resolve(provider, net));
    }
};

Web3.providers = {
    HttpProvider: ProvidersPackage.HttpProvider,
    WebsocketProvider: ProvidersPackage.WebsocketProvider,
    IpcProvider: ProvidersPackage.IpcProvider
};

module.exports = Web3;

