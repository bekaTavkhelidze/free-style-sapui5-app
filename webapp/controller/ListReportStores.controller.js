sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/ui/model/BindingMode',
  ],
  (
    Controller,
    Filter,
    FilterOperator,
    JSONModel,
    MessageToast,
    BindingMode
  ) => {
    'use strict';

    return Controller.extend('freestylesapui5app.controller.ListReportStores', {
      _oDialog: null,

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
        this._oDialog ??= await this.loadFragment({
          name: 'freestylesapui5app.fragments.CreateStoreDialog',
        });
        this.getView().addDependent(this._oDialog);

        const oDialogData = new JSONModel({
          Name: '',
          FloorArea: '',
          Address: '',
          Email: '',
          PhoneNumber: '',
        });
        this.getView().setModel(oDialogData, 'createStory');

        const oValidationCreateStore = new JSONModel({
          Name: true,
          FloorArea: true,
          Address: true,
          Email: true,
          PhoneNumber: true,
        });
        oValidationCreateStore.setDefaultBindingMode(BindingMode.TwoWay);

        this.getView().setModel(oValidationCreateStore, 'validation');

        this._oDialog.open();
      },

      onCreateButtonPress() {
        const oFormData = this.getView().getModel('createStory').getData();

        // validate Input
        if (!this._validate()) return;

        const oBundle = this.getView().getModel('i18n').getResourceBundle();

        const oDataModel = this.getOwnerComponent().getModel();
        oDataModel.create('/Stores', oFormData, {
          success: () => {
            this.onCancelButtonPress();
            var sSuccessMsg = oBundle.getText('successTextCreateStore');
            MessageToast.show(sSuccessMsg);
          },
          error() {
            this.onCancelButtonPress();
            var sErrorMsg = oBundle.getText('errorTextCreateStore');
            MessageToast.show(sErrorMsg);
          },
        });
      },
      onCancelButtonPress() {
        this._oDialog.close();
      },

      _validate() {
        const oInput = this.getView().getModel('createStory').getData();
        const oValidationModel = this.getView().getModel('validation');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        oValidationModel.setProperty('/Name', !!oInput.Name);

        const bEmailValid = !!oInput.Email && emailRegex.test(oInput.Email);
        oValidationModel.setProperty('/Email', bEmailValid);

        oValidationModel.setProperty('/Address', !!oInput.Address);
        oValidationModel.setProperty('/FloorArea', !!oInput.FloorArea);
        oValidationModel.setProperty('/PhoneNumber', !!oInput.PhoneNumber);

        return !Object.values(oValidationModel.getData()).includes(false);
      },

      onDeleteButtonPress() {
        const oTable = this.byId('idStoresTable');
        const oSelected = oTable.getSelectedItems();

        const oDataModel = this.getView().getModel();
        const oBundle = this.getView().getModel('i18n').getResourceBundle();

        oSelected.forEach((oItem) => {
          const sPath = oItem.getBindingContext().getPath();

          oDataModel.remove(sPath, {
            success: () => {
              var sSuccessMsg = oBundle.getText('successTextDeleteStore');
              MessageToast.show(sSuccessMsg);
            },
            error: () => {
              var sErrorMsg = oBundle.getText('errorTextCreateStore');
              MessageToast.show(sErrorMsg);
            },
          });
        });
      },
    });
  }
);
