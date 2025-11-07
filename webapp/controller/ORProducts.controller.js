sap.ui.define(['sap/ui/core/mvc/Controller'], (Controller) => {
  'use strict';

  return Controller.extend('freestylesapui5app.controller.ORProducts', {
    onInit() {
      const oRouter = this.getOwnerComponent().getRouter();
      console.log(oRouter);
      console.log(oRouter.getRoute('ORProducts'));
      oRouter
        .getRoute('ORProducts')
        .attachPatternMatched(this.onObjectMatched, this);
    },
    onObjectMatched(oEvent) {
      var activeId = window.decodeURIComponent(
        oEvent.getParameter('arguments').id
      );

      console.log(activeId);
    },
  });
});
