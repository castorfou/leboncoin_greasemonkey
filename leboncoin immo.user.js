// ==UserScript==
// @name         leboncoin immo
// @namespace    leboncoin
// @version      0.1
// @description  Garde le prix des annonces immo, voir ce que j'ai déjà vu, les évolutions de prix, l'age de l'annonce,...
// @author       Guillaume Ramelet
// @match        https://www.leboncoin.fr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {


    function getLink(linkName) {
        const metas = document.getElementsByTagName('link');
        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('name') === linkName) {
                return metas[i].getAttribute('content');
            }
        }
        return '';
    }
    function getMeta(metaName) {
        const metas = document.getElementsByTagName('meta');

        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('property') === metaName) {
                return metas[i].getAttribute('content');
            }
        }

        return '';
    }

    function _isContains(json, value) {
        let contains = false;
        Object.keys(json).some(key => {
            contains = typeof json[key] === 'object' ?
                _isContains(json[key], value) : json[key] === value;
            return contains;
        });
        return contains;
    }

    function conserve_annonce(id_annonce, auj, prix_annonce) {
        var annonce_existante = GM_getValue(id_annonce)
        var fiche_annonce
        if (annonce_existante == undefined) {
            //console.log('nouvelle annonce '+id_annonce)
            fiche_annonce = JSON.parse('{"prix":[{}] }')
        } else {
            //console.log('annonce existante '+id_annonce)
            fiche_annonce = JSON.parse(annonce_existante)

            //pour reinitialiser les valeurs au lancement
            //à commenter quand c'est bien initialisé
            //fiche_annonce = JSON.parse('{"prix":[{}] }')
        }
        if (! _isContains(fiche_annonce,auj)) {
            fiche_annonce.prix.push({ date: auj, prix: prix_annonce });
        }
        //console.log('contenu fiche '+JSON.stringify(fiche_annonce, null, 2))
        GM_setValue(id_annonce, JSON.stringify(fiche_annonce, null, 2));
    }



    'use strict';


    console.log("leboncoin immo loading...");

    var url = document.URL
    var page = url.split('/');
    var print_page =''
    for (var i=0; i<page.length;i++) {
        print_page+=' '+page[i]
    }
    var today = new Date()
    var aujourdhui = today.toISOString().split('T')[0];
    var id_annonce = ''

    console.log(page[3])

    if (page[3] == 'ventes_immobilieres') {
        console.log('annonce individuelle...')
        var prix_annonce = document.getElementsByClassName("_3gP8T _25LNb _35DXM")[0].innerHTML;
        prix_annonce=prix_annonce.split('&nbsp;')[0].replace(/\s/g, '');
        console.log('prix affiché : '+prix_annonce)
        var og_url = getMeta('og:url');
        id_annonce = og_url.split('/')[4].split('.')[0];
        console.log('annonce id '+id_annonce);
        console.log(aujourdhui);

        var contenu_cache = GM_getValue(id_annonce)
        console.log('contenu cache '+contenu_cache)

    }

    if (page[3].startsWith('recherche?category=9')) {
        console.log('liste des annonces...')
        var liste_annonces = document.getElementsByClassName("styles_adCard__2YFTi styles_classified__aKs-b");
        //console.log(liste_annonces[0]).singleNodeValue
        //http://xpather.com/  AdCard__AdCardLink-sc-1h74x40-0 cHZrAn
        for (i=0; i<liste_annonces.length; i++) {
            var id_annonce_lien = document.evaluate('. //a[@class="AdCard__AdCardLink-sc-1h74x40-0 cHZrAn"]/@href', liste_annonces[i], null, XPathResult.STRING_TYPE, null).stringValue;
            id_annonce = id_annonce_lien.split('/')[2].split('.')[0]
            //console.log('ID annonce: '+id_annonce)
            var prix_annonce_complet = document.evaluate('. //span[@class="AdCardPrice__Amount-bz31y2-1 dflscE"]', liste_annonces[i], null, XPathResult.STRING_TYPE, null).stringValue;
            prix_annonce = prix_annonce_complet.replace(/(\s*)(€*)/g, '');
            //console.log(prix_annonce)
            conserve_annonce(id_annonce, aujourdhui, prix_annonce);
        }


    }
    console.log("leboncoin immo stopping...");

})();