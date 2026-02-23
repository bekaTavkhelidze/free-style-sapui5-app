/*global QUnit*/

sap.ui.define(
  [
    'sap/ui/test/opaQunit',
    './pages/App',
    './pages/ListReportStores',
    './pages/ObjectPageStoreDetails',
  ],
  function (opaTest) {
    'use strict';

    QUnit.module('List Report Journey');

    opaTest('Should load List Report correctly', function (Given, When, Then) {
      Given.iStartMyApp();

      Then.onTheAppPage.iShouldSeeTheApp();
      Then.onTheListReportPage.iShouldSeeThePage();
      Then.onTheListReportPage.iShouldSeeTheFilterBar();
      Then.onTheListReportPage.iShouldSeeTheTable();

      When.onTheListReportPage.iPressOnFirstRow();

      Then.onTheObjectPage.iShouldSeeTheObjectPage();
      Then.onTheObjectPage.iShouldSeeTheProductsTable();

      When.onTheObjectPage.iPressTheEditButton();
      Then.onTheObjectPage.iShouldSeeInputsEditable();

      Then.iTeardownMyApp();
    });
  },
);
