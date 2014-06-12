// Firesomething extension for Mozilla Firefox
// Updated for Firefox 23.0 by Mira Leung
// Original code by  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

function getElement(strID) {
	return document.getElementById(strID);
}

function setAboutImage(strURL) {
	if (!strURL) { return; }
	var oImg = new Image();
	oImg.addEventListener("load",
		function() {
			try { getElement("version").style.display = "none"; } catch(ex) {}
			try { getElement("copyright").style.marginTop = "10px"; } catch(ex) {}
			try { getElement("detailsBox").style.paddingTop = "8px"; } catch(ex) {}
			try {
				var clientBox = getElement("clientBox");
				clientBox.style.backgroundImage = "url(" + strURL + ")";
				clientBox.style.paddingTop = oImg.height + "px";
				clientBox.style.minWidth = oImg.width + "px";
				clientBox.style.backgroundPosition = "top center";
				clientBox.style.backgroundRepeat = "no-repeat";
			} catch(ex) {}
		},
		false);
	oImg.src = strURL;
}

function firesomething_init() {
	try {
		document.documentElement.getButton("extra2").addEventListener("command",
			function() { setTimeout(extendCredits, 500); },			
			false);
		document.documentElement.setAttribute("aboutlabel", "< " + strAbout);
	} catch(ex) { dump(ex + "\n"); }
}

function extendCredits() {
	try {
		var i, j, hTextNode, strValue, cLI;
		var hDoc = getElement("creditsIframe").contentWindow.document;
		var cUL = hDoc.getElementsByTagName("ul");
		for (i=0; i < cUL.length; i++) {
			if (cUL[i].parentNode.getAttribute("class") != "creditsGroup") { continue; }
			cLI = cUL[i].getElementsByTagName("li");
			for (j=0; j < cLI.length; j++) {
				hTextNode = cLI[j].firstChild;
				if (!hTextNode) { continue; }
				strValue = StringTrim(hTextNode.nodeValue);
				if (strValue == "") { continue; }
				if (getRandom(0,2) && !isNickRequired(strValue)) { continue; }
				if (isNickProhibited(strValue)) { continue; }
				hTextNode.nodeValue = addNick(strValue);
			}
		}
	} catch(ex) { dump(ex + "\n"); }
}

function addNick(strName) {
	if (strName == "Stephen Colbert") { return "Stephen \"High Snow Lord of the Blowlands\" Colbert"; }
	if (strName == "MozillaZine Community") { return "That Crazy MozillaZine Community"; }
	if (/ /.test(strName)) { return strName.replace(/ /, " \"" + getRandDefName() + "\" "); }
	return strName + " \"The " + getRandDefName() + "\"";
}

function isNickRequired(strValue) {
	switch (strValue) {
		case "Pierre Chanial":
		case "Stephen Colbert":
		case "Ben Goodger":
		case "David Hyatt":
		case "Blake Ross":
		case "Brian Ryner":
		case "Boris Zbarsky":
		case "MozillaZine Community":
			return true;
	}
	return false;
}

function isNickProhibited(strValue) {
	switch (strValue) {
		case "Google":
		case "Yahoo!":
		case "IBM":
		case "Sun Microsystems":
		case "Oregon State University - Open Source Lab":
		case "A&amp;R Edelman":
		case "arcendo communications GmbH":
		case "fuse pr":
		case "Radiant Core":
		case "MozillaZine":
		case "MozDev":
			return true;
	}
	return false;
}

function getRandDefName() {
	return arrPrefixes[getRandom(0, arrPrefixes.length - 1)] + arrNames[getRandom(0, arrNames.length - 1)];
}

function getRandom(min, max) {
	min = parseInt(min); max = parseInt(max);
	return Math.round((max - min) * Math.random()) + min;
}

function StringTrim(strIn) {
	if (/^\s/.test(strIn)) { strIn = strIn.replace(/^\s{1,}/, ""); }
	if (/\s$/.test(strIn)) { strIn = strIn.replace(/\s{1,}$/, ""); }
	return strIn;
}



var oFS = window.opener.firesomething;
var myRegExp = new RegExp(oFS.DefaultName, "");
var strAbout = oFS.DefaultAbout.replace(myRegExp, oFS.ShortName);
getElement("aboutDialog").setAttribute("title", strAbout);
setAboutImage(oFS.getPref("extensions.firesomething.images.about"));

var hDefaultBranch = oFS.Prefs.getService().getDefaultBranch("extensions.firesomething.");
var arrPrefixes = hDefaultBranch.getCharPref("lists.prefixes").split("|");
var arrNames = hDefaultBranch.getCharPref("lists.names").split("|");

window.addEventListener("load", firesomething_init, false);
