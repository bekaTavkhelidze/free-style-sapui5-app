sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox',
  ],
  (Controller, Filter, FilterOperator, MessageBox) => {
    'use strict';

    return Controller.extend(
      'freestylesapui5app.controller.ObjectPageStoreDetails',
      {
        _activeId: null,
        onInit() {
          const oRouter = this.getOwnerComponent().getRouter();

          oRouter
            .getRoute('ObjectPageStoreDetails')
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched(oEvent) {
          const sActiveId = oEvent.getParameter('arguments').id;

          this._activeId = sActiveId;
          const oData = this.getView().bindElement({
            path: "/Stores(guid'" + sActiveId + "' )",
            Parameters: { $expand: 'Products' },
          });
        },

        onSearchFieldProductSearch(oValue) {
          const aFilter = [];
          const sQuery = oValue.getParameter('query').trim();

          if (sQuery) {
            aFilter.push(
              new Filter({
                filters: [
                  new Filter('Name', FilterOperator.Contains, sQuery),
                  new Filter('Status', FilterOperator.Contains, sQuery),
                  new Filter(
                    'Price_amount',
                    FilterOperator.Contains,
                    Number(sQuery)
                  ),
                  new Filter('ID', FilterOperator.Contains, sQuery),
                ],
                and: false,
              })
            );
          }

          const oTable = this.byId('idProductsTable');

          const oBinding = oTable.getBinding('items');

          oBinding.filter(aFilter);
        },

        onStoreLinkGoBackToStoresListReportPress() {
          const oModel = this.getView().getModel();
          if (oModel.getPendingChanges()) {
            const vErrorMessage = this.getOwnerComponent()
              .getModel('i18n')
              .getResourceBundle()
              .getText('unsavedChange');
            return MessageBox.warning(vErrorMessage);
          }

          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo('RouteListReport');
        },

        onColumnListItemGoToProductDetailChartPress() {
          const oModel = this.getView().getModel();
          if (oModel.getPendingChanges()) {
            const vErrorMessage = this.getOwnerComponent()
              .getModel('i18n')
              .getResourceBundle()
              .getText('unsavedChange');
            return MessageBox.warning(vErrorMessage);
          }

          this.getOwnerComponent()
            .getRouter()
            .navTo('ChartPageStoreDetails', { id: this._activeId });
        },

        onEditButtonPress() {
          const oEditMode = this.getView().getModel('isEditModeActive');
          oEditMode.setProperty('/isEditModeActive', true);
        },

        onSaveButtonPress() {
          const oEditMode = this.getView().getModel('isEditModeActive');
          const oModel = this.getView().getModel();
          console.log(oModel.getPendingChanges());
          if (!this._validate()) return;
          // oModel.submitChanges();

          oEditMode.setProperty('/isEditModeActive', false);
        },
        _validate() {
          const oData = this.getView().getBindingContext().getObject();

          const oValidationModel = this.getView().getModel('validation');
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          oValidationModel.setProperty('/PhoneNumber', !!oData.PhoneNumber);

          oValidationModel.setProperty('/Name', !!oData.Name);

          const bEmailValid = !!oData.Email && emailRegex.test(oData.Email);
          oValidationModel.setProperty('/Email', bEmailValid);

          oValidationModel.setProperty('/Address', !!oData.Address);
          oValidationModel.setProperty('/FloorArea', !!oData.FloorArea);

          if (
            !oData.PhoneNumber ||
            !oData.Address ||
            !oData.FloorArea ||
            !oData.Name ||
            bEmailValid
          )
            return false;
        },

        onCancelButtonPress() {
          const oEditMode = this.getView().getModel('isEditModeActive');
          const oModel = this.getView().getModel();

          oModel.resetChanges();

          oEditMode.setProperty('/isEditModeActive', false);
        },
      }
    );
  }
);
