sap.ui.define(['sap/ui/core/mvc/Controller'], (Controller) => {
  'use strict';

  return Controller.extend('freestylesapui5app.controller.ListReport', {
    onInit() {
      const oODataModel = this.getView().getModel();
      const oModelFromComp = this.getOwnerComponent().getModel();

      oModelFromComp.read('/Stores', {
        success: (oData) => {
          const oJsonModel = new sap.ui.model.json.JSONModel(oData.results);
          console.log(oJsonModel);
          this.getView().setModel(oJsonModel, 'Stores');
        },
      });
    },
  });
});
