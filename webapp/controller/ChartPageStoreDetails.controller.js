sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/routing/History',
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
  ],
  function (Controller, History, FlattenedDataset, ChartFormatter, Format) {
    'use strict';
    return Controller.extend(
      'freestylesapui5app.controller.ChartPageStoreDetails',
      {
        onInit() {
          const oHistory = History.getInstance();
          const sPreviousHash = oHistory.getPreviousHash();
          if (!sPreviousHash) {
            this.getView().byId('goBackBtn').setText('Stores');
          }

          const oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute('ChartPageStoreDetails')
            .attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(oEvent) {
          const sActiveId = globalThis.decodeURIComponent(
            oEvent.getParameter('arguments').id
          );

          const oDataModel = this.getView().getModel();

          oDataModel.read("/Products(guid'" + sActiveId + "' )", {
            urlParameters: {
              $expand: 'Comment',
            },

            success: () => {
              const oContext = oDataModel.createBindingContext(
                "/Products(guid'" + sActiveId + "')"
              );
              this.getView().setBindingContext(oContext);
            },
          });
        },

        onGoBackToProductsObjectPage() {
          const oHistory = History.getInstance();
          const sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash) {
            globalThis.history.go(-1);
          } else {
            this.getView().byId('goBackBtn').setText('Stores');
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo('RouteListReport');
          }
        },
      }
    );
  }
);
