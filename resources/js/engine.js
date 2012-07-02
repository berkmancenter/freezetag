// GET VARIABLES
// from: http://stackoverflow.com/questions/439463/how-to-get-get-and-post-variables-with-jquery
var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

var url = $_GET["url"];
var per_page = $_GET['per_page'];
var colorSchemeNumber = $_GET['color'];
var intime = $_GET['intime'];
var itertions = $_GET['iterations'];
var totalOnPage = $_GET('total_on_page');


// ACTUAL FUNCTIONS
function addItem(title, tags, author, date, link, ageColor){
	var tagString = "";
	for (var i = 0; i < tags.length; i++){
		tagString += ("<div>" + tags[i] + "</div>");
	}
	var item = '\
		<a href="' + link + '" style="opacity:0; display:none; border-right-color:' + ageColor + '">\
			<div class="title">' + title + '</div>\
			<div class="tags">' + tagString + '</div>\
			<div class="by">Authored by ' + author + ', on ' + date + '</div>\
		</a>';
	var itemEl = $(item);
	$("#wrapper").prepend(itemEl);
	itemEl.slideDown(1000, function (){
		itemEl.animate({
			opacity:1 
		}, 2000);
	});
	if ($('#wrapper > div').length > totalOnPage){
		$($('#wrapper > div')[totalOnPage]).remove();
	}
}

var feed = new Array();

function fetchNews(){
	$.ajax({
		url: url + pageNumberStr,
		dataType: 'jsonp',
		jsonp: "callback",
		jsonpCallback: 'fetchNewsComplete'
	});
}

function fetchNewsComplete(data){
	feed = data.feed_items;
	dropNews();
}

var ageMax = 5; // in days

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
		var ageColor = Color("#FF6600");
		var today = new Date();
		var dayDiff = today.getTime() - dateObj.getTime();
		dayDiff /= 1000; // get seconds
		dayDiff /= 60; // get minutes
		dayDiff /= 60; // get hours
		dayDiff /= 24; // get days
		if (dayDiff > ageMax){
			dayDiff = ageMax;
		}
		var ratio = dayDiff / ageMax;
		ageColor.desaturate(ratio);
		// add it
		addItem(currItem.title, tags, author, dateStr, currItem.url, ageColor.hexString());
		// set it to occur again
		setTimeout(dropNews, 5000);
	}
}

$(document).ready(function (){
	fetchNews('fetchNewsComplete');
});

function getTime(feedItem){
	var dateObj = new Date(feedItem.date_published);
	var date = dateObj.getTime();
	return date;
}

var currentTailPage;
var loadingTailEnd = false;
