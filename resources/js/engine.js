// ***********************
// *** GET VARIABLES *****
// ***********************

// from: http://stackoverflow.com/questions/439463/how-to-get-get-and-post-variables-with-jquery

// parses get variables PHP style

var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

//  all relevant get variables
// TODO: Set defaults so code doesn't break if undefined

var url = unescape($_GET["url"]);
var per_page = parseInt($_GET['per_page']);
var colorSchemeId = $_GET['color'];
var slideAnimateTime = parseInt($_GET['animate_time']) * 200;
var fadeAnimateTime = parseInt($_GET['animate_time']) * 800;
var pauseTime = parseInt($_GET['pause_time']) * 1000;
var iterations = parseInt($_GET['iterations']);
var totalOnPage = parseInt($_GET['total_on_page']);
var tagsOn = ($_GET['tags'] == 'true' ? true : false);

// ***********************
// *** News Functions ****
// ***********************

// Actually adds the news item to the DOM

function addItem(title, tags, author, date, link){
	var tagString = "";
	for (var i = 0; i < tags.length && tagsOn; i++){
		tagString += ("<div>" + tags[i] + "</div>");
	}
	var item = '\
		<a class="' + colorSchemeId + '" href="' + link + '" style="opacity:0; display:none; ">\
			<div class="title">' + title + '</div>\
			<div class="tags">' + tagString + '</div>\
			<div class="by">Authored by ' + author + ', on ' + date + '</div>\
		</a>';
	var itemEl = $(item);
	$("#wrapper").prepend(itemEl);
	itemEl.slideDown(slideAnimateTime, function (){
		itemEl.animate({
			opacity:1 
		}, fadeAnimateTime);
	});
	if ($('#wrapper > a').length > totalOnPage){
		var toRemove = $($('#wrapper > a')[totalOnPage]);
		toRemove.fadeOut(fadeAnimateTime, function(){
			toRemove.remove();
		});
	}
}

// gets news via API, first a function which makes the request and then the jsonp callback

var feed = new Array();

function fetchNews(){
	$.ajax({
		url: url + "?per_page=" + per_page,
		dataType: 'jsonp',
		jsonp: "callback",
		jsonpCallback: 'fetchNewsComplete'
	});
}

function fetchNewsComplete(data){
	for (var i = 0; i < iterations; i++){
		feed = feed.concat(data.feed_items);
	}
	dropNews();
}

// var used as an end point to determine whether news is old news
var ageMax = 5; // in days

// removes news item from queue to display, then it cals itself again
function dropNews(){
	// get news item
	var currItem = feed.shift();
	if (typeof(currItem) !== 'undefined'){
		// parse data
		var tags = new Array();
		if (!$.isEmptyObject(currItem.tags)){
			tags = tags.concat(currItem.tags.tags);
		}
		var author = ((currItem.authors == "" || currItem.authors == null)? "(author unknown)" : currItem.authors);
		var dateObj = new Date(currItem.date_published);
		var dateStr = (["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])[dateObj.getDay()] + " " + (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
		// get age color 
		var today = new Date();
		var dayDiff = today.getTime() - dateObj.getTime();
		dayDiff /= 1000; // get seconds
		dayDiff /= 60; // get minutes
		dayDiff /= 60; // get hours
		dayDiff /= 24; // get days
		if (dayDiff > ageMax){
			dayDiff = ageMax;
		}
		// TODO: possibly remove, or find use for it
		var ratio = dayDiff / ageMax;
		// add it
		addItem(currItem.title, tags, author, dateStr, currItem.url);
		// loop
		setTimeout(dropNews, pauseTime + slideAnimateTime + fadeAnimateTime);
	}
	else {
		fetchNews();
	}
}

$(document).ready(function (){
	fetchNews('fetchNewsComplete');
});