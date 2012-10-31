# FreezeTag

## About

FreezeTag is a dashboard style display for [TagTeam](http://tagteam.harvard.edu): displaying current news in TagTeam hubs in a very aesthetically-pleasing way. It is meant to be put up on extra monitors, or possibly televisions, as a way to provide current news without forcing the user(s) to do anything; one such scenario when this might be helpful would be to display this in the lounge of a conference.

Given that it can use data from any TagTeam hub, you can customize the inputs to be about virtually any topic.

## Usage

Simply download FreezeTag and open up config.html in a browser. Once you fill out the config page (which is pretty self documented) it will take you to feed.html and begin to display the news on the selected hub. 

Index.html is a boilerplate for displaying multiple feeds on one page. Simply put the feed URL as the iframe's source and then position them however you wish.

## Specs

FreezeTag is completely client side and uses: HTML, CSS, JS, JQuery, and color.js. In addition, all data is fetched from TagTeam using JSONP, allowing FreezeTag to be completely client side and still run on any server.

Background texture from http://subtlepatterns.com

## License

This application is released under a GPLv3 license.

Copyright President and Fellows of Harvard College, 2012
