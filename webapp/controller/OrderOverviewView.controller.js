sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/NumberFormat"
], function(Controller, JSONModel, MessageToast, NumberFormat) {
	"use strict";

	return Controller.extend("converted.orderoverviewview.controller.OrderOverviewView", {
		onInit: function() {
			// Load mock data for orders
			const oOrderModel = new JSONModel();
			oOrderModel.loadData("model/mockData/orders.json");
			this.getView().setModel(oOrderModel, "orders");

			//Initialize Number Format for currency
			this._currencyFormat = NumberFormat.getCurrencyInstance({
				currencyCode: false
			});
		},

		//Search functionality
		onSearch: function(oEvent) {
			const sQuery = oEvent.getParameter("newValue").toLowerCase();
			const oTable = this.getView().byId("ordersTable");
			const oBinding = oTable.getBinding("items");

			const aFilters = [];
			if (sQuery && sQuery.length > 0) {
				aFilters.push(new sap.ui.model.Filter([
					new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Amount", sap.ui.model.FilterOperator.Contains, sQuery)
				], false));
			}

			oBinding.filter(aFilters);
		},


		//Export to CSV functionality
		onExportToCSV: function() {
			const oTable = this.getView().byId("ordersTable");
			const aData = oTable.getModel("orders").getData().Orders;

			if (!aData || aData.length === 0) {
				MessageToast.show("No data to export");
				return;
			}

			const sCsvContent = this._convertToCSV(aData);
			const oBlob = new Blob([sCsvContent], { type: "text/csv" });
			const sUrl = URL.createObjectURL(oBlob);
			const oLink = document.createElement("a");
			oLink.href = sUrl;
			oLink.download = "orders.csv";
			oLink.click();
			URL.revokeObjectURL(sUrl);
		},

		_convertToCSV: function(aData) {
			const aHeaders = ["OrderID", "Product", "Status", "Amount"];
			let sCsv = aHeaders.join(",") + "\n";

			aData.forEach(row => {
				let aValues = aHeaders.map(header => {
					let value = row[header];
					//handle Currency formatting
					if (header === 'Amount') {
						value = this._currencyFormat.format(value, 'EUR');
					}
					return `"${(value || '').toString().replace(/"/g, '""')}"`;
				});
				sCsv += aValues.join(",") + "\n";
			});
			return sCsv;
		}
	});
});
