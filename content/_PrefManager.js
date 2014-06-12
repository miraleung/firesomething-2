// Firesomething extension for Mozilla Firefox
// Updated for Firefox 23.0 by Mira Leung
// Original code by Michael O'Rourke / Cosmic Cat Creations (http://www.cosmicat.com/)
// For licensing terms, please refer to readme.txt in this extension's XPInstall 
// package or its installation directory on your computer.

com.firesomething.prefmanager = {
		getService: function() {
		try { return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		} catch(ex) { dump(ex + "\n"); return null; }
	},
	getInterface: function() {
		try { return this.getService().QueryInterface(Components.interfaces.nsIPrefBranchInternal);
		} catch(ex) { dump(ex + "\n"); return null; }
	},
	rootBranch: null,
	getRootBranch: function() {
		if (!com.firesomething.prefmanager.rootBranch) { 
			com.firesomething.prefmanager.rootBranch = com.firesomething.prefmanager.getService().getBranch(null); 
		}
		return com.firesomething.prefmanager.rootBranch;
	},
	prefTypes: new Array(),
	getPrefType: function(strName) {
		if (strName in com.firesomething.prefmanager.prefTypes) { return com.firesomething.prefmanager.prefTypes[strName]; }
		var strType = "Char";
		var iPB = Components.interfaces.nsIPrefBranch;
		switch (com.firesomething.prefmanager.getRootBranch().getPrefType(strName)) {
			case iPB.PREF_STRING: strType = "Char"; break;
			case iPB.PREF_INT: strType = "Int"; break;
			case iPB.PREF_BOOL: strType = "Bool"; break;
		}
		com.firesomething.prefmanager.prefTypes[strName] = strType;
		return strType;
	},
	getPref: function(strName) {
		var strType = com.firesomething.prefmanager.getPrefType(strName);
		//var strCode = 'com.firesomething.prefmanager.getRootBranch().get' + strType + 'Pref("' + strName + '")';
		try { // eval(strCode);
			switch (strType) {
			case "Char": return com.firesomething.prefmanager.getRootBranch().getCharPref(strName);
			case "Int": return com.firesomething.prefmanager.getRootBranch().getIntPref(strName);
			case "Bool": return com.firesomething.prefmanager.getRootBranch().getBoolPref(strName);
			}
		} catch(ex) { 
			dump(ex + "\n"); 
		}
		return null;
	},
	setPref: function(strName, varValue) {
		var strType = com.firesomething.prefmanager.getPrefType(strName);
		if (strType == "Char") { varValue = '"' + varValue + '"'; }
		var strCode = 'com.firesomething.prefmanager.getRootBranch().set' + strType + 'Pref("' + strName + '", ' + varValue + ')';
		try { //eval(strCode); 
			switch (strType) {
			case "Char": return com.firesomething.prefmanager.getRootBranch().setCharPref(strName);
			case "Int": return com.firesomething.prefmanager.getRootBranch().setIntPref(strName);
			case "Bool": return com.firesomething.prefmanager.getRootBranch().setBoolPref(strName);
			}
		} catch(ex) { 
			dump(ex + "\n"); 
		}
	},
	addPrefObserver: function(strObserver, strDomain) {
		com.firesomething.prefmanager.observer = strObserver;
		com.firesomething.prefmanager.obsDomain = (strDomain == "root") ? "" : com.firesomething.prefmanager.domain;
		try { com.firesomething.prefmanager.getInterface().addObserver(com.firesomething.prefmanager.obsDomain, com.firesomething.prefmanager, false); } catch(ex) { dump(ex + "\n"); }
	},
	removePrefObserver: function() {
		try { com.firesomething.prefmanager.getInterface().removeObserver(com.firesomething.prefmanager.obsDomain, com.firesomething.prefmanager); } catch(ex) { dump(ex + "\n"); }
	},
	observe: function(subject, topic, prefName) {
		//try { eval(com.firesomething.prefmanager.observer + "(subject, topic, prefName);"); } catch(ex) { dump(ex + "\n"); }
		try {com.firesomething.prefmanager.observer(subject, topic, prefName); } catch(ex) { dump(ex + "\n"); }
	},
	
	
		// whether a preference exists
	exists: function(prefName) {
		var pref=Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefService).
		getBranch(startPoint);

		return pref.getPrefType(prefName) != 0;
	},

	// returns the named preference, or defaultValue if it does not exist
	getValue: function(prefName, defaultValue) {
		var pref=Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefService); //.getBranch(startPoint);

		var prefType=pref.getPrefType(prefName);

		// underlying preferences object throws an exception if pref doesn't exist
		if (prefType==pref.PREF_INVALID) {
			return defaultValue;
		}

		switch (prefType) {
			case pref.PREF_STRING: return pref.getCharPref(prefName);
			case pref.PREF_BOOL: return pref.getBoolPref(prefName);
			case pref.PREF_INT: return pref.getIntPref(prefName);
			default: return defaultValue;
		}
	}

	/* // sets the named preference to the specified value. values must be strings,
	// booleans, or integers.
	setValue: function(prefName, value) {
		var pref=Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefService).
		getBranch(startPoint);

		var prefType=typeof(value);

		switch (prefType) {
			case "string":
			case "boolean":
				break;
			case "number":
				if (value % 1 != 0) {
					throw new Error("Cannot set preference to non integral number");
				}
				break;
			default:
				throw new Error("Cannot set preference with datatype: " + prefType);
		}

		// underlying preferences object throws an exception if new pref has a
		// different type than old one. i think we should not do this, so delete
		// old pref first if this is the case.
		if (this.exists(prefName) && prefType != typeof(this.getValue(prefName))) {
			this.remove(prefName);
		}

		// set new value using correct method
		switch (prefType) {
			case "string": pref.setCharPref(prefName, value); break;
			case "boolean": pref.setBoolPref(prefName, value); break;
			case "number": pref.setIntPref(prefName, Math.floor(value)); break;
		}
	},

	// deletes the named preference or subtree
	remove: function(prefName) {
		var pref=Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefService).
		getBranch(startPoint);

		pref.deleteBranch(prefName);
	},

	// call a function whenever the named preference subtree changes
	watch: function(prefName, watcher) {
		var pref=Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefService).
		getBranch(startPoint);

		// construct an observer
		var observer={
			observe:function(subject, topic, prefName) {
				watcher(prefName);
			}
		};

		// store the observer in case we need to remove it later
		observers[watcher]=observer;

		pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal).
			addObserver(prefName, observer, false);
	},

	// stop watching
	unwatch: function(prefName, watcher) {
		var pref=Components.classes["@mozilla.org/preferences-service;1"].
		getService(Components.interfaces.nsIPrefService).
		getBranch(startPoint);

		if (observers[watcher]) {
			pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal)
				.removeObserver(prefName, observers[watcher]);
		}
	} */
	
}; 