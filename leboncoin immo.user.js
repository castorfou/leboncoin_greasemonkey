// ==UserScript==
// @name         leboncoin immo
// @namespace    leboncoin
// @version      0.4
// @description  Garde le prix des annonces immo, voir ce que j'ai déjà vu, les évolutions de prix, l'age de l'annonce,...
// @author       Guillaume Ramelet
// @match        https://www.leboncoin.fr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


$(document).ready(function() {

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

    function conserve_annonce(id_annonce, auj, prix_annonce, ecrase = false) {
        var annonce_existante = GM_getValue(id_annonce)
        var fiche_annonce
        console.debug('function conserve_annonce '+id_annonce+' '+auj+' '+prix_annonce+' '+ecrase)
        if (annonce_existante == undefined) {
            console.debug('nouvelle annonce '+id_annonce)
            fiche_annonce = JSON.parse('{"prix":[] }')
        } else {
            console.debug('annonce existante '+id_annonce)
            fiche_annonce = JSON.parse(annonce_existante)

            //decommenter pour reinitialiser les valeurs au lancement (et commenter la ligne du haut qui risque de planter si contenu ,non-json)
            //à recommenter après l'initialisation
            //fiche_annonce = JSON.parse('{"prix":[] }')
        }
        if (! _isContains(fiche_annonce,auj)) {
            console.debug('La fiche '+id_annonce+' ne contient pas '+auj)
            fiche_annonce.prix.push({ date: auj, prix: prix_annonce });
        } else { if (ecrase) {
            console.debug('ecraser la fiche '+id_annonce);
            $(fiche_annonce.prix).each(function (index){
                console.debug('index fiche_annonce '+index)
                if(fiche_annonce.prix[index].date == auj){
                    fiche_annonce.prix.splice(index,1); // This will remove the object that first name equals to Test1
                    return false; // This will stop the execution of jQuery each loop.
                }
            });

            fiche_annonce.prix.push({ date: auj, prix: prix_annonce });
        }
        }
        //affiche_donnees_annonce(id_annonce)
        GM_setValue(id_annonce, JSON.stringify(fiche_annonce, null, 2));
    }

    function supprime_annonce(id_annonce) {
        GM_setValue(id_annonce,JSON.stringify(JSON.parse('{"prix":[] }'), null, 2))
    }

    function affiche_donnees_annonce(id_annonce) {
        var annonce_existante = GM_getValue(id_annonce)
        annonce_existante = JSON.parse(annonce_existante)
        var prix_max = getMax(annonce_existante.prix, 'prix')
        var prix_min = getMin(annonce_existante.prix, 'prix')
        console.log('contenu fiche '+JSON.stringify(annonce_existante, null, 2))
        console.log('prix max', prix_max,' - ','prix min',prix_min)
        affiche_prix_min_max(prix_min, prix_max)
    }

    function affiche_prix_min_max(prix_min, prix_max) {
        //https://stackoverflow.com/questions/12354989/how-can-i-display-the-output-of-my-userscript-in-a-floating-box-on-the-side-of-t
        console.debug('affiche_prix_min_max debut', prix_min, prix_max)
        var box = document.createElement( 'div' );
        box.id = 'myAlertePrix';
        GM_addStyle(
            ' #myAlertePrix {           ' +
            '    opacity: 0.9;          ' +
            '    background: white;     ' +
            '    border: 1px solid red; ' +
            '    padding: 4px;          ' +
            '    position: relative;    ' +
            '    max-width: 400px;      ' +
            ' } '
        );
        $( "body").append( box );
        console.debug( $( "#myAlertePrix" ) )

        box.textContent = "Prix mini "+prix_min+"\nPrix maxi "+prix_max;

        $( "#myAlertePrix" ).insertBefore( $( ".styles_Gallery__Y7BAy" ) )
        //$( ".myAlertePrix" ).appendTo("._1cnjm")
        //$( "._1cnjm" ).first().append(box)
        console.debug( $( "#grid" ) )
        box.addEventListener( 'click', function () {
            box.parentNode.removeChild( box );
        }, true );
        console.debug('affiche_prix_min_max fin')
    }


    function getMax(arr, prop) {
        console.debug('getMax',arr, prop)
        var max=null;
        for (var i=0 ; i<arr.length ; i++) {
            if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop])) {
                max = arr[i];
                console.debug('max',max[prop])
            }
        }
        return max[prop];
    }
    function getMin(arr, prop) {
        var min=null;
        for (var i=0 ; i<arr.length ; i++) {
            if (min == null || parseInt(arr[i][prop]) < parseInt(min[prop])) {
                min = arr[i];
            }
        }
        return min[prop];
    }




    'use strict';
    //test jquery
    //alert("There are " + $('a').length + " links on this page.");



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

    console.debug('Nous sommes sur la page '+page[3])
    //supprime_annonce(1978905111)
    conserve_annonce(1978905111, '2021-05-09', '759901', true)

    if (page[3] == 'ventes_immobilieres') {
        console.log('annonce individuelle...')
        var prix_annonce = document.getElementsByClassName("_3gP8T _25LNb _35DXM")[0].innerHTML;
        prix_annonce=prix_annonce.split('&nbsp;')[0].replace(/\s/g, '');
        console.log('prix affiché : '+prix_annonce)
        var og_url = getMeta('og:url');
        id_annonce = og_url.split('/')[4].split('.')[0];
        console.log('annonce id '+id_annonce);
        //console.log(aujourdhui);
        affiche_donnees_annonce(id_annonce)
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

});