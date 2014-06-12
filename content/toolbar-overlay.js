// Firesomething extension for Mozilla Firefox
// Updated for Firefox 23.0 by Mira Leung
// Original code by  Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

if(!com) var com={};
if(!com.firesomething) com.firesomething={};
if(!com.firesomething.firesm) com.firesomething.firesm={};

com.firesomething.firesm = {
	
	init: function() {
	this.Prefs = com.firesomething.prefmanager;
		com.firesomething.firesm.DefaultName = document.getElementById("main-window").getAttribute("title");
		this.initUserAgentStuff;
		var bSameName = this.getPref("extensions.firesomething.samename");
		if (bSameName) {
			var arrWin = this.getOtherWindows;
			if (arrWin.length > 0) {
				var oFS = arrWin[0].FireSomething;
				this.setNewBrowserName(oFS.Vendor, oFS.ShortName, oFS.TitleComment);
			} else {
				this.setNames();
			}
		} else {
			this.setNames();
		} 
		window.addEventListener("focus", function() { this.setUserAgent(); }, false);
		document.getElementById("content").addEventListener("DOMTitleChanged", com.firesomething.firesm.setNames, false);
		this.addPrefObserver("com.firesomething.firesm.prefObserver");
	},

	init2: function() {
		document.getElementById("content").addEventListener("DOMTitleChanged", com.firesomething.firesm.setNames, false);  // footnote "DOMTitle"
		this.updateFiresm();
		this.DefaultAbout = document.getElementById("aboutName").getAttribute("label");
		setTimeout("com.firesomething.firesm.setDelayedNames();", 100);
	}, 
	
	uninit: function() {
  },
	
	getPref: function(strName) {
		return com.firesomething.prefmanager.getPref(strName);
	}, 
	
	prefObserver: function(subject, topic, prefName) {
		switch (prefName) {
			case "extensions.firesomething.images.about":
			case "extensions.firesomething.images.throbber1":
			case "extensions.firesomething.images.throbber2":
				return;
			default: this.setNames();
		}
	},
	
	setNames: function (){
		var fsmprefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch("extensions.firesomething.");
			var bSameName = fsmprefs.getBoolPref("samename");
			var bTopWin = (window == this.getWM().getMostRecentWindow(null));
			if (bSameName && !bTopWin) { return; }
			var vendor = this.getRandomName("extensions.firesomething.lists.vendors");
			var spacer = this.getRandomName("extensions.firesomething.lists.spacers");
			var prefix = this.getRandomName("extensions.firesomething.lists.prefixes");
			var suffix = this.getRandomName("extensions.firesomething.lists.names");
			suffix = suffix.substr(0, 1).toUpperCase() + suffix.substr(1);
			var comment = com.firesomething.firesm.getRandomName("extensions.firesomething.lists.comments");
			this.setNewBrowserName(vendor + spacer, prefix + suffix, comment);
			if (bSameName) { this.updateOtherWindows(); }
			if (bTopWin) { this.setUserAgent; }
			this.setUserAgent();
	},
	
	setNewBrowserName: function(strVendor, strShortName, strTitleComment) {
		var fsmprefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch("extensions.firesomething.");
		var newstr = Components.classes["@mozilla.org/supports-string;1"]
      .createInstance(Components.interfaces.nsISupportsString);
		newstr.data = strShortName;
		var bSameName = fsmprefs.getBoolPref("samename");
		if (!bSameName || this.getOtherWindows().length <= 0) {
			fsmprefs.setComplexValue("browsername", Components.interfaces.nsISupportsString, newstr);
			newstr.data = strVendor;
			fsmprefs.setComplexValue("vendor", Components.interfaces.nsISupportsString, newstr);
			newstr.data = strTitleComment;
			fsmprefs.setComplexValue("comment", Components.interfaces.nsISupportsString, newstr);
			this.Vendor = strVendor;
			this.ShortName = strShortName;
			this.TitleComment = strTitleComment;
		} else {
			this.ShortName = fsmprefs
				.getComplexValue("browsername", Components.interfaces.nsISupportsString).data;
			this.Vendor = fsmprefs
				.getComplexValue("vendor", Components.interfaces.nsISupportsString).data;
			this.TitleComment = fsmprefs
				.getComplexValue("comment", Components.interfaces.nsISupportsString).data;
		}
				
		document.getElementById("main-window")
			.setAttribute("titlemodifier", this.Vendor + " " + this.ShortName + " " + this.TitleComment);
		document.getElementById("appmenu-button").setAttribute("label", this.ShortName); 
		this.updateFiresm();
		setTimeout("com.firesomething.firesm.setDelayedNames();", 100);
	},
	
	setDelayedNames: function() {
		try {
			com.firesomething.firesm.updateFiresm();
			var myRegExp = new RegExp(this.DefaultName, "");
			var strAbout = com.firesomething.firesm.DefaultAbout.replace(
				myRegExp, 
				this.Vendor + com.firesomething.firesm.ShortName);
			document.getElementById("aboutName").setAttribute("label", strAbout);
		} catch(ex) { dump(ex + "\n"); }
	},
	updateFiresm: function() {
		try { document.getElementById("content").updateFiresm(); } catch(ex) {}
	},
	
	initUserAgentStuff: function() {
		var info = Components.classes["@mozilla.org/xre/app-info;1"]
           .getService(Components.interfaces.nsIXULAppInfo);
		var myRegExp = new RegExp("\/", "");
			this.OriginalBrand = info.name;
			this.OriginalVersion = info.version; 
	},
	setUserAgent: function() {
		var fsmprefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch("extensions.firesomething.");
		var genprefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch("general.useragent.");
		var newua = Components.classes["@mozilla.org/supports-string;1"]
      .createInstance(Components.interfaces.nsISupportsString);
			
		var info = Components.classes["@mozilla.org/xre/app-info;1"]
           .getService(Components.interfaces.nsIXULAppInfo);
		var myRegExp = new RegExp("\/", "");	
		this.OriginalBrand = info.name;
		this.OriginalVersion = info.version;
		this.ShortName = fsmprefs.getComplexValue("browsername", Components.interfaces.nsISupportsString).data;
		var userAgentTag = "";
		var rebrandua = fsmprefs.getBoolPref("useragent.rebrand");

		if (rebrandua == true) {
			genprefs.clearUserPref("override");
			userAgentTag += this.ShortName + "/" + this.OriginalVersion;
			var comment = fsmprefs.getComplexValue("useragent.comment", Components.interfaces.nsISupportsString).data;

			if (comment) {
				comment = comment.replace(/#name#/g, this.OriginalBrand);
				comment = comment.replace(/#version#/g, this.OriginalVersion);
				userAgentTag += " (" + comment + ")";
			}

			newua.data = window.navigator.userAgent + " " + userAgentTag;
			genprefs.setComplexValue("override", Components.interfaces.nsISupportsString, newua);

		} else {
			try { 
				genprefs.clearUserPref("override");
			} catch(ex) {}
		}
	},
	
	updateOtherWindows: function() {
		var fsmprefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch("extensions.firesomething.");
		var shortname = fsmprefs
			.getComplexValue("browsername", Components.interfaces.nsISupportsString).data;
		var vendor = fsmprefs
			.getComplexValue("vendor", Components.interfaces.nsISupportsString).data;
		var comment = fsmprefs
			.getComplexValue("comment", Components.interfaces.nsISupportsString).data;
		var arrWin = this.getOtherWindows();
		for (var i=0; i < arrWin.length; i++) {
			try { 
			arrWin[i].FireSomething.setNewBrowserName(this.Vendor, this.ShortName, this.TitleComment); 
			} catch(ex) { 
				dump(ex + "\n"); 
			}
		}
	},
	
	getOtherWindows: function() {
		var hWin, arrWin = new Array();
		var e = this.getWM().getEnumerator(null);
		while (e.hasMoreElements()) {
			hWin = e.getNext();
			if (hWin == window) { continue; }
			if (hWin.document.getElementById("main-window")) { arrWin[arrWin.length] = hWin; }
		}
		return arrWin;
	},
	getWM: function() {
		return Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
	},
	
 	showFiresmSettings: function(flag = 0) {
		if (this.preferencesWindow == null || this.preferencesWindow.closed) {
			var features;
			var optionsURL = "chrome://firesm/content/prefwindow-Main.xul";
			var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
			let instantApply = true; 
			features = "chrome,firesomething,height=350,width=400,toolbar,scrollbars,centerscreen,resizable=yes" + (instantApply ? ",dialog=no" : ",modal");

			this.preferencesWindow = openDialog(optionsURL, "", features);
		} else {
			this.preferencesWindow.focus();
		}
	}, 
	
	getRandomName: function(strPref) {
		var arrNames = this.getPref(strPref).split("|");
		return arrNames[this.getRandom(0, arrNames.length - 1)];
	},
	
	getRandom: function(min, max) {
		min = parseInt(min); max = parseInt(max);
		return Math.round((max - min) * Math.random()) + min;
	}, 
	
};

window.addEventListener("load", function() {com.firesomething.firesm.init2(); }, false);
window.addEventListener("unload", function() {com.firesomething.firesm.uninit()}, false);

