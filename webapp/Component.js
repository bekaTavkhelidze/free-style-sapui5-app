sap.ui.define(
  [
    'sap/ui/core/UIComponent',
    'freestylesapui5app/model/models',
    'sap/ui/model/json/JSONModel',
  ],
  (UIComponent, models, JSONModel) => {
    'use strict';

    return UIComponent.extend('freestylesapui5app.Component', {
      metadata: {
        manifest: 'json',
        interfaces: ['sap.ui.core.IAsyncContentCreation'],
      },

      init() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // set the device model
        this.setModel(models.createDeviceModel(), 'device');

        const oDataModel = this.getModel();

        // enable routing
        this.getRouter().initialize();

        const isEditModeActive = new JSONModel({
          isEditModeActive: false,
        });

        this.setModel(isEditModeActive, 'isEditModeActive');
      },
    });
  }
);
