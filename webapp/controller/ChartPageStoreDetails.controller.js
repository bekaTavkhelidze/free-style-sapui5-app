sap.ui.define(
  ['sap/ui/core/mvc/Controller', 'sap/ui/core/routing/History'],
  function (Controller, History) {
    'use strict';
    return Controller.extend(
      'freestylesapui5app.controller.ChartPageStoreDetails',
      {
        onInit() {
          const oBundle = this.getOwnerComponent()
            .getModel('i18n')
            .getResourceBundle();

          this.byId('idVizFrame').setVizProperties({
            title: {
              visible: true,
              text: oBundle.getText('chartTitle'),
            },
          });
        },
        onStoreDetailsLinkPress() {
          const oHistory = History.getInstance();
          const sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash) {
            globalThis.history.go(-1);
          } else {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo('RouteListReport');
          }
        },
      }
    );
  }
);
