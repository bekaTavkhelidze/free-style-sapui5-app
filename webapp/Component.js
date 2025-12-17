sap.ui.define(
  [
    'sap/ui/core/UIComponent',
    'freestylesapui5app/model/models',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/BindingMode',
  ],
  (UIComponent, models, JSONModel, BindingMode) => {
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

        const oValidationCreateStore = new JSONModel({
          Name: true,
          FloorArea: true,
          Address: true,
          Email: true,
          PhoneNumber: true,
        });
        oValidationCreateStore.setDefaultBindingMode(BindingMode.TwoWay);

        this.setModel(oValidationCreateStore, 'validation');

        const createMode = new JSONModel({
          isEditModeActive: false,
        });

        this.setModel(createMode, 'createMode');
      },
    });
  }
);
