sap.ui.define(
  [
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/actions/EnterText',
  ],
  function (Opa5, Press, EnterText) {
    'use strict';

    var sViewName = 'ObjectPageStoreDetails';

    Opa5.createPageObjects({
      onTheObjectPage: {
        actions: {
          iPressTheEditButton: function () {
            return this.waitFor({
              viewName: sViewName,
              controlType: 'sap.m.Button',
              matchers: function (oButton) {
                return oButton.getText().includes('Edit');
              },
              actions: new Press(),
              errorMessage: 'Edit button not found',
            });
          },

          iPressTheSaveButton: function () {
            return this.waitFor({
              viewName: sViewName,
              controlType: 'sap.m.Button',
              matchers: function (oButton) {
                return oButton.getType() === 'Accept';
              },
              actions: new Press(),
            });
          },

          iPressTheBreadcrumbLink: function () {
            return this.waitFor({
              viewName: sViewName,
              controlType: 'sap.m.Link',
              actions: new Press(),
              errorMessage: 'Breadcrumb link not found',
            });
          },
        },

        assertions: {
          iShouldSeeTheObjectPage: function () {
            return this.waitFor({
              viewName: sViewName,
              id: 'idStoreObjectPageLayout',
              success: function (oPage) {
                Opa5.assert.ok(oPage, 'Object Page is visible');
              },
            });
          },

          iShouldSeeTheProductsTable: function () {
            return this.waitFor({
              viewName: sViewName,
              id: 'idProductsTable',
              success: function (oTable) {
                Opa5.assert.ok(oTable, 'Products table is visible');
              },
            });
          },

          iShouldSeeInputsEditable: function () {
            return this.waitFor({
              viewName: sViewName,
              id: 'idNameStoreInput',
              success: function (oInput) {
                Opa5.assert.ok(oInput.getEditable(), 'Input is editable');
              },
            });
          },
        },
      },
    });
  },
);
