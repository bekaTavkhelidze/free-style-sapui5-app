sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
  ],
  (Controller, Filter, FilterOperator) => {
    'use strict';

    return Controller.extend('freestylesapui5app.controller.ListReportStores', {
      onGoButtonPressed(oEvent) {
        const oFilterBarSelectionSet = oEvent.getParameter('selectionSet');

        const aFilters = [];

        for (let oItem of oFilterBarSelectionSet) {
          const sValue = oItem.getValue().trim();

          const sName = oItem.getName();

          if (sValue) {
            aFilters.push(new Filter(sName, FilterOperator.Contains, sValue));
          }
        }

        const oList = this.byId('StoresTable');
        const oBinding = oList.getBinding('items');
        oBinding.filter(aFilters);
      },

      onGoToORProductsDetailPress(oEvent) {
        const oItem = oEvent.getSource();
        const oContext = oItem.getBindingContext();
        const sProductId = oContext.getProperty('ID');

        this.getOwnerComponent()
          .getRouter()
          .navTo('ObjectPageStoreDetails', { id: sProductId });
      },
    });
  }
);
