sap.ui.define(
  [
    'freestylesapui5app/controller/ListReportStores.controller',
    'sap/ui/thirdparty/sinon',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageToast', // <- add this
    'sap/m/MessageBox',
  ],
  function (
    Controller,
    sinon,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast,
    MessageBox,
  ) {
    'use strict';

    // ------------------- _validate() -------------------
    QUnit.module('_validate()', {
      beforeEach: function () {
        this.oController = new Controller();

        this.oValidationModel = new JSONModel({
          Name: true,
          Email: true,
          Address: true,
          FloorArea: true,
          PhoneNumber: true,
        });

        sinon.stub(this.oController, 'getOwnerComponent').returns({
          getModel: (sName) => {
            if (sName === 'validation') return this.oValidationModel;
          },
        });
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test('Valid input should return true', function (assert) {
      const oCreateModel = new JSONModel({
        Name: 'Store 1',
        Email: 'test@test.com',
        Address: 'Tbilisi',
        FloorArea: '100',
        PhoneNumber: '123456',
      });

      sinon
        .stub(this.oController, 'getModel')
        .withArgs('createStory')
        .returns(oCreateModel);

      const result = this.oController._validate();
      assert.strictEqual(result, true, 'Validation passed');
    });

    QUnit.test('Invalid email should return false', function (assert) {
      const oCreateModel = new JSONModel({
        Name: 'Store 1',
        Email: 'wrongEmail',
        Address: 'Tbilisi',
        FloorArea: '100',
        PhoneNumber: '123456',
      });

      sinon
        .stub(this.oController, 'getModel')
        .withArgs('createStory')
        .returns(oCreateModel);

      const result = this.oController._validate();
      assert.strictEqual(result, false, 'Validation failed due to email');
    });

    // ------------------- _filterFunction() -------------------
    QUnit.module('_filterFunction()', {
      beforeEach: function () {
        this.oController = new Controller();
        this.oBinding = { filter: sinon.spy() };

        sinon.stub(this.oController, 'byId').returns({
          getBinding: () => this.oBinding,
        });
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test('Should call binding.filter()', function (assert) {
      const aFilters = ['dummy'];
      this.oController._filterFunction(aFilters);
      assert.ok(this.oBinding.filter.calledOnce, 'Filter was called');
    });

    // ------------------- onFilterBarGoButtonSearch() -------------------
    QUnit.module('onFilterBarGoButtonSearch', {
      beforeEach: function () {
        this.oController = new Controller();
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test(
      'onFilterBarGoButtonSearch: Should create filters and call _filterFunction',
      function (assert) {
        assert.expect(1);

        var oController = new Controller();

        // Mock table and binding
        var oFakeBinding = { filter: sinon.spy() };
        var oFakeTable = {
          getBinding: sinon.stub().withArgs('items').returns(oFakeBinding),
        };
        oController.byId = sinon
          .stub()
          .withArgs('idStoresTable')
          .returns(oFakeTable);

        // Mock event
        var oFakeEvent = {
          getParameter: sinon
            .stub()
            .withArgs('selectionSet')
            .returns([{ getName: () => 'Name', getValue: () => 'Test' }]),
        };

        // Call the method
        oController.onFilterBarGoButtonSearch(oFakeEvent);

        // Assert filter was called
        assert.ok(
          oFakeBinding.filter.calledOnce,
          '_filterFunction should be called by onFilterBarGoButtonSearch',
        );
      },
    );
    // ------------------- Navigation -------------------
    QUnit.module('onColumnListItemGoToProductsDetailPress', {
      beforeEach: function () {
        this.oController = new Controller();
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test('Should navigate to ObjectPageStoreDetails', function (assert) {
      const oNavSpy = sinon.spy();

      sinon.stub(this.oController, 'getOwnerComponent').returns({
        getRouter: () => ({
          navTo: oNavSpy,
        }),
      });

      const oEvent = {
        getSource: () => ({
          getBindingContext: () => ({
            getProperty: () => '123',
          }),
        }),
      };

      this.oController.onColumnListItemGoToProductsDetailPress(oEvent);

      assert.ok(oNavSpy.calledWith('ObjectPageStoreDetails', { id: '123' }));
    });

    // ------------------- onInputListReportLiveChange() -------------------
    QUnit.module('onInputListReportLiveChange', {
      beforeEach: function () {
        this.oController = new Controller();
        this.oBinding = { filter: sinon.spy() };
        sinon.stub(this.oController, 'byId').returns({
          getBinding: () => this.oBinding,
        });
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test(
      'Should create filters and call _filterFunction',
      function (assert) {
        var oEvent = {
          getSource: () => ({ getValue: () => 'Test' }),
        };
        this.oController.onInputListReportLiveChange(oEvent);
        assert.ok(
          this.oBinding.filter.calledOnce,
          '_filterFunction should be called for live change',
        );
      },
    );

    // ------------------- onCancelButtonPress() -------------------
    QUnit.module('onCancelButtonPress', {
      beforeEach: function () {
        this.oController = new Controller();
        this.oDialog = { close: sinon.spy() };
        this.oController._oDialog = this.oDialog;
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test('Should call _oDialog.close()', function (assert) {
      this.oController.onCancelButtonPress();
      assert.ok(
        this.oDialog.close.calledOnce,
        '_oDialog.close should be called',
      );
    });

    QUnit.module('onAddButtonStorePress', {
      beforeEach: function () {
        this.oController = new Controller();

        // Fake dialog
        this.oDialog = { open: sinon.spy() };

        // Stub getView
        this.oController.getView = sinon.stub().returns({
          addDependent: sinon.spy(),
          setModel: sinon.spy(),
        });

        // Stub loadFragment to return fake dialog
        this.oController.loadFragment = sinon
          .stub()
          .returns(Promise.resolve(this.oDialog));
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test('Should open dialog and set model', function (assert) {
      var done = assert.async();
      this.oController.onAddButtonStorePress().then(() => {
        assert.ok(
          this.oController.loadFragment.calledOnce,
          'loadFragment should be called',
        );
        assert.ok(
          this.oController.getView().addDependent.calledWith(this.oDialog),
          'Dialog added as dependent',
        );
        assert.ok(
          this.oController.getView().setModel.calledOnce,
          'Model should be set',
        );
        assert.ok(this.oDialog.open.calledOnce, 'Dialog.open should be called');
        done();
      });
    });

    // ------------------- onCreateButtonPress() -------------------
    QUnit.module('onCreateButtonPress', {
      beforeEach: function () {
        this.oController = new Controller();

        // Stub getModel for i18n and createStory
        this.oController.getModel = sinon.stub();
        this.oController.getModel.withArgs('i18n').returns({
          getResourceBundle: () => ({ getText: (sKey) => sKey }),
        });

        const oCreateModel = new JSONModel({
          Name: 'Store 1',
          Email: 'test@test.com',
          Address: 'Tbilisi',
          FloorArea: '100',
          PhoneNumber: '123456',
        });
        this.oController.getModel.withArgs('createStory').returns(oCreateModel);

        // Stub getOwnerComponent().getModel()
        this.oValidationModel = new JSONModel({
          Name: true,
          Email: true,
          Address: true,
          FloorArea: true,
          PhoneNumber: true,
        });

        this.oDataModel = { create: sinon.spy() };

        sinon.stub(this.oController, 'getOwnerComponent').returns({
          getModel: (sName) => {
            if (sName === 'validation') return this.oValidationModel;
            return this.oDataModel;
          },
          getRouter: () => ({ navTo: sinon.spy() }),
        });

        // Stub MessageToast and MessageBox
        sinon.stub(MessageToast, 'show');
        sinon.stub(MessageBox, 'error');

        // Stub onCancelButtonPress to prevent errors
        this.oController.onCancelButtonPress = sinon.spy();
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test('Should call model.create and show success', function (assert) {
      const done = assert.async();

      this.oController.onCreateButtonPress();

      // Check that create was called
      assert.ok(
        this.oDataModel.create.calledOnce,
        'Model.create should be called',
      );

      // Simulate success callback
      const createCallArgs = this.oDataModel.create.getCall(0).args;
      createCallArgs[2].success(); // Call success()

      assert.ok(
        this.oController.onCancelButtonPress.calledOnce,
        'onCancelButtonPress called',
      );
      assert.ok(MessageToast.show.calledOnce, 'MessageToast.show called');
      done();
    });

    // ------------------- onDeleteButtonPress() -------------------
    QUnit.module('onDeleteButtonPress', {
      beforeEach: function () {
        this.oController = new Controller();
        this.oRemoveSpy = sinon.spy();
        var oSelectedItem = {
          getBindingContext: () => ({
            getPath: () => '/Stores(1)',
          }),
        };
        var oTable = { getSelectedItems: () => [oSelectedItem] };
        this.oController.byId = sinon
          .stub()
          .withArgs('idStoresTable')
          .returns(oTable);
        this.oController.getModel = sinon.stub().returns({
          remove: this.oRemoveSpy,
          getResourceBundle: () => ({ getText: () => 'Success' }),
        });
      },
      afterEach: function () {
        sinon.restore();
      },
    });

    QUnit.test(
      'Should remove selected items and show success',
      function (assert) {
        this.oController.onDeleteButtonPress();
        assert.ok(
          this.oRemoveSpy.calledOnce,
          'Model.remove should be called for selected item',
        );
      },
    );
  },
);
