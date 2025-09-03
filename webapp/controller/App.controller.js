sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
	"use strict";

	return Controller.extend("converted.orderoverviewview.controller.App", {
		onInit: function() {
			// Get the router instance
			const oRouter = UIComponent.getRouterFor(this);

			// Handle routing errors
			oRouter.attachBypassed(function(oEvent) {
				console.warn("Route bypassed:", oEvent.getParameter("hash"));
			});

			// Navigate to the main view if no hash is provided
			if (!window.location.hash || window.location.hash === "#") {
				oRouter.navTo("RouteMain");
			}
		}
	});
});
