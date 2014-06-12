var AboutFireSomethingService = {
	impl: {
		ioService: null,
		newChannel: function(uri) {
			if (!this.ioService)
				this.ioService = Components.classes["@mozilla.org/network/io-service;1"]
								.getService(Components.interfaces.nsIIOService);
			return this.ioService.newChannel("chrome://firesomething/content/book_of_mozilla/firesomething.xhtml",null,uri);
		},
		QueryInterface: function(iid) {
			if (!iid.equals(Components.interfaces.nsISupports) &&
				!iid.equals(Components.interfaces.nsIAboutModule))
				throw Components.results.NS_ERROR_NO_INTERFACE;
			return this;
		}
	},
	factory: {
		createInstance: function(outer, iid) {
			if (outer != null)
				throw Components.results.NS_ERROR_NO_AGGREGATION;
			
			if (!iid.equals(Components.interfaces.nsIAboutModule) &&
				!iid.equals(Components.interfaces.nsISupports))
				throw Components.results.NS_ERROR_INVALID_ARG;
			
			return AboutFireSomethingService.impl.QueryInterface(iid);
		}
	},
	register: function() {
		var compman = Components.manager;
		compman.QueryInterface(Components.interfaces.nsIComponentRegistrar);
		var cid = Components.ID('{1dd0cb48-aea3-4a52-8b29-01429a542863}');
		var contractid = "@mozilla.org/network/protocol/about;1?what=firesomething";
		
		if (!compman.isCIDRegistered(cid)) {
			compman.registerFactory(cid, "AboutFireSomethingService", contractid, AboutFireSomethingService.factory);
		}
	}
}

// register
try { AboutFireSomethingService.register(); } catch(ex) { dump(ex+"\n"); }

var AboutFireFoxService = {
	impl: {
		ioService: null,
		newChannel: function(uri) {
			if (!this.ioService)
				this.ioService = Components.classes["@mozilla.org/network/io-service;1"]
								.getService(Components.interfaces.nsIIOService);
			return this.ioService.newChannel("chrome://firesomething/content/book_of_mozilla/firefox.xhtml",null,uri);
		},
		QueryInterface: function(iid) {
			if (!iid.equals(Components.interfaces.nsISupports) &&
				!iid.equals(Components.interfaces.nsIAboutModule))
				throw Components.results.NS_ERROR_NO_INTERFACE;
			return this;
		}
	},
	factory: {
		createInstance: function(outer, iid) {
			if (outer != null)
				throw Components.results.NS_ERROR_NO_AGGREGATION;
			
			if (!iid.equals(Components.interfaces.nsIAboutModule) &&
				!iid.equals(Components.interfaces.nsISupports))
				throw Components.results.NS_ERROR_INVALID_ARG;
			
			return AboutFireFoxService.impl.QueryInterface(iid);
		}
	},
	register: function() {
		var compman = Components.manager;
		compman.QueryInterface(Components.interfaces.nsIComponentRegistrar);
		var cid = Components.ID('{1dd0cb48-aea3-4a53-8b29-01429a542863}');
		var contractid = "@mozilla.org/network/protocol/about;1?what=firefox";
		
		if (!compman.isCIDRegistered(cid)) {
			compman.registerFactory(cid, "AboutFireFoxService", contractid, AboutFireFoxService.factory);
		}
	}
}

// register
try { AboutFireFoxService.register(); } catch(ex) { dump(ex+"\n"); }
