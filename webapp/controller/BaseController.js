sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
  'use strict';

  return Controller.extend('freestylesapui5app.controller.BaseController', {
    /**
     * Returns the view model (default or named).
     * @param {string} [sName] Model name (optional)
     * @returns {sap.ui.model.Model}
     */
    getModel: function (path = null) {
      if (!path) {
        return this.getView().getModel();
      }
      return this.getView().getModel(path);
    },
  });
});
