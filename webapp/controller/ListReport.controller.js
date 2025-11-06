sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
  ],
  (Controller, Filter, FilterOperator, JSONModel) => {
    'use strict';

    return Controller.extend('freestylesapui5app.controller.ListReport', {
      onInit() {
        const oModelFromComp = this.getOwnerComponent().getModel();
        oModelFromComp.read('/Stores', {
          success: (oData) => {
            const oJsonModel = new JSONModel(oData.results);
            this.getView().setModel(oJsonModel, 'Stores');
          },
        });
      },

      onGoButtonPressed() {
        const oFilter = this.getView().byId('filterbar');

        const aFilterItems = oFilter.getFilterGroupItems();
        const aFilters = [];

        aFilterItems.forEach((oItem) => {
          const sName = oItem.getName();
          const oControl = oItem.getControl();
          const sValue = oControl.getValue && oControl.getValue();
          if (sValue) {
            aFilters.push(new Filter(sName, FilterOperator.Contains, sValue));
          }
        });

        const oList = this.byId('StoresTable');
        const oBinding = oList.getBinding('rows');
        oBinding.filter(aFilters);
      },
    });
  }
);
