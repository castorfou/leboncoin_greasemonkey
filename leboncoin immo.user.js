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




    'use strict';


    console.log("leboncoin immo loading...");

    var url = document.URL
    var page = url.split('/');
    var print_page =''
    for (var i=0; i<page.length;i++) {
        print_page+=' '+page[i]
    }

    console.log(page[3])

    if (page[3] == 'ventes_immobilieres') {
        console.log('annonce individuelle...')
        var prix_annonce = document.getElementsByClassName("_3gP8T _25LNb _35DXM")[0].innerHTML;
        prix_annonce=prix_annonce.split('&nbsp;')[0].replace(/\s/g, '');
        console.log('prix affiché : '+prix_annonce)
        var og_url = getMeta('og:url');
        var id_annonce = og_url.split('/')[4].split('.')[0];
        console.log('annonce id '+id_annonce);
        var today = new Date()
        var aujourdhui = today.toISOString().split('T')[0];
        console.log(aujourdhui);

        var contenu_cache = GM_getValue(id_annonce)
        console.log('contenu cache '+contenu_cache)

        GM_setValue(id_annonce, aujourdhui+' '+prix_annonce);

    }

    if (page[3].startsWith('recherche?category=9')) {
        console.log('liste des annonces...')
    }
    console.log("leboncoin immo stopping...");

})();