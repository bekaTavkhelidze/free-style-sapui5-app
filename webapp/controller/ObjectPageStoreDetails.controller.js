sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
  ],
  (Controller, Filter, FilterOperator) => {
    'use strict';

    return Controller.extend(
      'freestylesapui5app.controller.ObjectPageStoreDetails',
      {
        onInit() {
          const oRouter = this.getOwnerComponent().getRouter();

          oRouter
            .getRoute('ObjectPageStoreDetails')
            .attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(oEvent) {
          const sActiveId = globalThis.decodeURIComponent(
            oEvent.getParameter('arguments').id
          );

          const ODataModel = this.getOwnerComponent().getModel();

          ODataModel.read("/Stores(guid'" + sActiveId + "' )", {
            urlParameters: {
              $expand: 'Products',
            },
            success: () => {
              const oContext = ODataModel.createBindingContext(
                "/Stores(guid'" + sActiveId + "')"
              );

              this.getView().setBindingContext(oContext);
            },
          });
        },

        onSearchProduct(oValue) {
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

          const oTable = this.byId('productsTable');

          const oBinding = oTable.getBinding('items');

          oBinding.filter(aFilter);
        },

        onGoBackToStoresListReport() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo('RouteListReport');
        },

        goToProductDetailChart(oEvent) {
          const oItem = oEvent.getSource();
          const oContext = oItem.getBindingContext();
          const sId = oContext.getProperty('ID');

          this.getOwnerComponent()
            .getRouter()
            .navTo('ChartPageStoreDetails', { id: sId });
        },
      }
    );
  }
);
