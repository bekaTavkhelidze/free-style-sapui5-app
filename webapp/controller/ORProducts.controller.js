sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
  ],
  (Controller, Filter, FilterOperator) => {
    'use strict';

    return Controller.extend('freestylesapui5app.controller.ORProducts', {
      onInit() {
        const oRouter = this.getOwnerComponent().getRouter();

        oRouter
          .getRoute('ORProducts')
          .attachPatternMatched(this.onObjectMatched, this);
      },
      onObjectMatched(oEvent) {
        const activeId = globalThis.decodeURIComponent(
          oEvent.getParameter('arguments').id
        );

        const ODataModel = this.getOwnerComponent().getModel();

        ODataModel.read("/Stores(guid'" + activeId + "' )", {
          urlParameters: {
            $expand: 'Products',
          },
          success: (oData) => {
            console.log(oData);
            const oContext = ODataModel.createBindingContext(
              "/Stores(guid'" + activeId + "')"
            );
            this.getView().setBindingContext(oContext);
          },
        });
      },
    });
  }
);
