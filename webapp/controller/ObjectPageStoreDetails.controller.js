sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
  ],
  (Controller, Filter, FilterOperator, JSONModel) => {
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
          console.log(oData.getObject());
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
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo('RouteListReport');
        },

        onColumnListItemGoToProductDetailChartPress() {
          this.getOwnerComponent()
            .getRouter()
            .navTo('ChartPageStoreDetails', { id: this._activeId });
        },

        onEditButtonPress() {
          const oEditMode = this.getView().getModel('isEditModeActive');

          const oObject = this.getView().getBindingContext().getObject();
          console.log(oObject);

          const oEditInputs = new JSONModel({
            Email: oObject.Email,
            Name: oObject.Name,
            PhoneNumber: oObject.PhoneNumber,
            Address: oObject.Address,
            FloorArea: oObject.FloorArea,
          });
          this.getView().setModel(oEditInputs, 'editInputs');
          oEditMode.setProperty('/isEditModeActive', true);
        },

        onCancelButtonPress() {
          const oEditMode = this.getView().getModel('isEditModeActive');

          oEditMode.setProperty('/isEditModeActive', false);
        },
      }
    );
  }
);
