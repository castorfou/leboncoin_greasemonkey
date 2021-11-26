# leboncoin_greasemonkey



### need tampermonkey to work

Tampermonkey is a clone of greasemonkey with stability on api

(e.g. gm functions)



installation tampermonkey:

https://www.tampermonkey.net/

https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search



### v0.7

I have fixed this issue

I use jQuery selector to detect object in the page:

* ```javascript
  var listeCartes =  $("[class='styles_adCard__2YFTi styles_classified__aKs-b']")
  ```

* ```javascript
  $( "#myAlertePrix" ).insertBefore( $( ".styles_Gallery__Y7BAy" ) )
  ```

and these selector style declarations are updated regularly by leboncoin. I then have to update those (lines 135 and 291) to continue. IT is surely feasible to have a more generic selector. 



I should delete nodes which are features cards ( styles_adCard styles_featured )



### to improve



I should delete nodes which are sponsored cards (styles_advertising) 
