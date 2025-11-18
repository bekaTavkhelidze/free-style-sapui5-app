sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
  ],
  (Controller, Filter, FilterOperator) => {
    'use strict';

    return Controller.extend('freestylesapui5app.controller.ListReportStores', {
      onFilterBarGoButtonSearch(oEvent) {
        const oFilterBarSelectionSet = oEvent.getParameter('selectionSet');

        const aFilters = [];

        for (let oItem of oFilterBarSelectionSet) {
          const sValue = oItem.getValue().trim();

          const sName = oItem.getName();

          if (sValue) {
            aFilters.push(new Filter(sName, FilterOperator.Contains, sValue));
          }
        }

        this.filterFunction(aFilters);
      },

      onColumnListItemGoToProductsDetailPress(oEvent) {
        const oItem = oEvent.getSource();
        const oContext = oItem.getBindingContext();
        const sProductId = oContext.getProperty('ID');

        this.getOwnerComponent()
          .getRouter()
          .navTo('ObjectPageStoreDetails', { id: sProductId });
      },

      onInputListReportLiveChange(oEvent) {
        const sValue = oEvent.getSource().getValue().trim();

        const aFilter = [];
        if (sValue) {
          aFilter.push(
            new Filter({
              filters: [
                new Filter('Name', FilterOperator.Contains, sValue),
                new Filter('Address', FilterOperator.Contains, sValue),
                new Filter('PhoneNumber', FilterOperator.Contains, sValue),
                new Filter('Email', FilterOperator.Contains, sValue),
              ],
              and: false,
            })
          );
        }

        this.filterFunction(aFilter);
      },

      filterFunction(aValue) {
        const oList = this.byId('idStoresTable');
        const oBinding = oList.getBinding('items');
        oBinding.filter(aValue);
      },
    });
  }
);
