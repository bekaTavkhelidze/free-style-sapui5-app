sap.ui.define(
  [
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/actions/EnterText',
  ],
  function (Opa5, Press, EnterText) {
    'use strict';

    var sViewName = 'ListReportStores';

    Opa5.createPageObjects({
      onTheListReportPage: {
        actions: {
          iPressTheAddButton: function () {
            return this.waitFor({
              viewName: sViewName,
              controlType: 'sap.m.Button',
              matchers: function (oButton) {
                return (
                  oButton.getText() ===
                  oButton
                    .getModel('i18n')
                    .getResourceBundle()
                    .getText('addStore')
                );
              },
              actions: new Press(),
              errorMessage: 'Add button not found',
            });
          },

          iSearchForStoreName: function (sText) {
            return this.waitFor({
              viewName: sViewName,
              controlType: 'sap.m.Input',
              actions: new EnterText({ text: sText }),
              errorMessage: 'Search input not found',
            });
          },
        },

        assertions: {
          iShouldSeeThePage: function () {
            return this.waitFor({
              viewName: sViewName,
              success: function (oView) {
                Opa5.assert.ok(oView, 'ListReportStores view is displayed');
              },
            });
          },

          iShouldSeeTheFilterBar: function () {
            return this.waitFor({
              viewName: sViewName,
              id: 'idListReportFilterBar',
              success: function (oFilterBar) {
                Opa5.assert.ok(oFilterBar, 'FilterBar is visible');
              },
              errorMessage: 'FilterBar not found',
            });
          },

          iShouldSeeTheTable: function () {
            return this.waitFor({
              viewName: sViewName,
              id: 'idStoresTable',
              success: function (oTable) {
                Opa5.assert.ok(oTable, 'Stores table is visible');
              },
              errorMessage: 'Stores table not found',
            });
          },

          iShouldSeeTableItems: function () {
            return this.waitFor({
              viewName: sViewName,
              id: 'idStoresTable',
              success: function (oTable) {
                Opa5.assert.ok(
                  oTable.getItems().length > 0,
                  'Table contains items',
                );
              },
              errorMessage: 'No items found in table',
            });
          },
        },
      },
    });
  },
);
