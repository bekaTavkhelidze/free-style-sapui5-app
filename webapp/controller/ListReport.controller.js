sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
  ],
  (Controller, Filter, FilterOperator) => {
    'use strict';

    return Controller.extend('freestylesapui5app.controller.ListReport', {
      onGoButtonPressed() {
        const oFilter = this.getView().byId('filterbar');

        const aFilterItems = oFilter.getFilterGroupItems();
        const aFilters = [];

        aFilterItems.forEach((oItem) => {
          const sName = oItem.getName();
          const oControl = oItem.getControl();
          const sValue = oControl.getValue();
          if (sValue) {
            aFilters.push(new Filter(sName, FilterOperator.Contains, sValue));
          }
        });

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
          .navTo('ORProducts', { id: sProductId });
      },
    });
  }
);
