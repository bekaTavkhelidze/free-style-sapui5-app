sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
  ],
  (Controller, Filter, FilterOperator, JSONModel, MessageToast) => {
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

        this._filterFunction(aFilters);
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

        this._filterFunction(aFilter);
      },

      _filterFunction(aValue) {
        const oList = this.byId('idStoresTable');
        const oBinding = oList.getBinding('items');
        oBinding.filter(aValue);
      },

      async onAddButtonStorePress() {
        this.oDialog ??= await this.loadFragment({
          name: 'freestylesapui5app.fragments.CreateStoreDialog',
        });
        this.getView().addDependent(this.oDialog);

        const ODialogData = new JSONModel({
          Name: '',
          FloorArea: '',
          Address: '',
          Email: '',
          PhoneNumber: '',
        });
        this.getView().setModel(ODialogData, 'createStory');

        this.oDialog.open();
      },

      onCreateButtonPress() {
        const oFormData = this.getView().getModel('createStory').getData();

        const oDataModel = this.getOwnerComponent().getModel();
        oDataModel.create('/Stores', oFormData, {
          success: () => {
            var sSuccessMsg =
              'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy\r\n eirmod.';
            MessageToast.show(sSuccessMsg);
            this.oDialog.close();
          },
          error() {
            var sErrorMsg = 'somthing went wrong';
            MessageToast.show(sErrorMsg);
            this.oDialog.close();
          },
        });
      },
      onCancelButtonPress() {
        this.oDialog.close();
      },
    });
  }
);
