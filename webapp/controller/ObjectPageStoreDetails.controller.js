sap.ui.define(
  [
    'freestylesapui5app/controller/BaseController',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
  ],
  (
    BaseController,
    Controller,
    Filter,
    FilterOperator,
    MessageBox,
    MessageToast
  ) => {
    'use strict';

    return BaseController.extend(
      'freestylesapui5app.controller.ObjectPageStoreDetails',
      {
        _activeId: null,

        _oInlineRow: [],
        onInit() {
          const oRouter = this.getOwnerComponent().getRouter();

          oRouter
            .getRoute('ObjectPageStoreDetails')
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched(oEvent) {
          const sActiveId = oEvent.getParameter('arguments').id;
          const oDataModel = this.getModel();
          this._activeId = sActiveId;
          const path = oDataModel.createKey('/Stores', {
            ID: sActiveId,
          });

          this.getView().bindElement({
            path,
            parameters: { $expand: 'Products' },
          });
        },

        onSearchFieldProductSearch(oValue) {
          const aFilter = [];
          const sQuery = oValue.getParameter('query').trim();
          if (sQuery) {
            aFilter.push(
              new Filter({
                filters: [
                  new Filter('Name', FilterOperator.Contains, sQuery),
                  new Filter('Status', FilterOperator.Contains, sQuery),
                  new Filter('MadeIn', FilterOperator.Contains, sQuery),
                  new Filter(
                    'Price_amount',
                    FilterOperator.EQ,
                    Number(sQuery) ? Number(sQuery) : -1
                  ),
                ],
                and: false,
              })
            );
          }
          const oTable = this.byId('idProductsTable');

          const oBinding = oTable.getBinding('items');
          oBinding.filter(aFilter);
        },

        onStoreLinkGoBackToStoresListReportPress() {
          const oModel = this.getModel();

          if (oModel.hasPendingChanges() || this._CheckCreateProductsInput()) {
            const vErrorMessage = this.getOwnerComponent()
              .getModel('i18n')
              .getResourceBundle()
              .getText('unsavedChange');
            return MessageBox.warning(vErrorMessage);
          }

          this._cancelEdit();
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo('RouteListReport');
        },

        onColumnListItemGoToProductDetailChartPress() {
          const oModel = this.getModel();

          if (oModel.hasPendingChanges() || this._CheckCreateProductsInput()) {
            const vErrorMessage = this.getOwnerComponent()
              .getModel('i18n')
              .getResourceBundle()
              .getText('unsavedChange');
            return MessageBox.warning(vErrorMessage);
          }

          this._cancelEdit();
          this.getOwnerComponent()
            .getRouter()
            .navTo('ChartPageStoreDetails', { id: this._activeId });
        },

        onEditButtonPress() {
          const oEditMode = this.getModel('createMode');

          oEditMode.setProperty('/isEditModeActive', true);
        },

        onSaveButtonPress() {
          const oEditMode = this.getModel('createMode');
          const oModel = this.getModel();
          const oBundle = this.getModel('i18n').getResourceBundle();

          const oTable = this.byId('idProductsTable');
          const oBinding = oTable.getBinding('items');

          const aProductContexts = oBinding.getCurrentContexts();
          const aProducts = aProductContexts.map((oCtx) => oCtx.getObject());
          const hasMissing = aProducts.some(
            (product) =>
              !product.Name ||
              !product.Status ||
              !product.MadeIn ||
              !product.Rating ||
              !product.Price_amount
          );

          const oPending = oModel.getPendingChanges();

          const aProductChanges = Object.keys(oPending).some((path) =>
            path.startsWith('Products(')
          );

          if (aProductChanges) {
            const oModelPendingData = oModel.getPendingChanges();

            const data = Object.values(oModelPendingData)[0];

            if (
              !data.Name ||
              !data.Status ||
              !data.MadeIn ||
              !data.Price_amount
            ) {
              MessageToast.show(oBundle.getText('ProductAddValidation'));
              return;
            }
          }

          if (hasMissing) return;
          if (!this._validate()) return;
          oModel.submitChanges({
            success: () => {
              const sSuccessMsg = oBundle.getText('successEdit');
              MessageToast.show(sSuccessMsg);
            },
            error() {
              this.onCancelButtonPress();
              const sErrorMsg = oBundle.getText('errorTextCreate');
              MessageBox.error(sErrorMsg);
            },
          });

          oEditMode.setProperty('/isEditModeActive', false);
        },

        _validate() {
          const oData = this.getView().getBindingContext().getObject();

          const oValidationModel = this.getModel('validation');
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          oValidationModel.setProperty('/PhoneNumber', !!oData.PhoneNumber);

          oValidationModel.setProperty('/Name', !!oData.Name);

          const bEmailValid = !!oData.Email && emailRegex.test(oData.Email);
          oValidationModel.setProperty('/Email', bEmailValid);

          oValidationModel.setProperty('/Address', !!oData.Address);
          oValidationModel.setProperty('/FloorArea', !!oData.FloorArea);

          if (
            !oData.PhoneNumber ||
            !oData.Address ||
            !oData.FloorArea ||
            !oData.Name ||
            !bEmailValid
          ) {
            return false;
          } else {
            return true;
          }
        },

        onCancelButtonPress() {
          const oModel = this.getModel();

          if (this._oInlineRow) {
            this._oInlineRow.map((row) => row.delete());
            this._oInlineRow = [];
          }
          oModel.resetChanges();
          this._cancelEdit();
        },

        _cancelEdit() {
          const oEditMode = this.getModel('createMode');
          oEditMode.setProperty('/isEditModeActive', false);
        },

        onDeleteButtonProductPress() {
          const oTable = this.getView().byId('idProductsTable');
          const aSelectedProducts = oTable.getSelectedItem();
          const oBundle = this.getModel('i18n').getResourceBundle();
          const sPath = aSelectedProducts.getBindingContext().getPath();

          const oModel = this.getModel();

          MessageToast.show(oBundle.getText('productDeleted'));
          oModel.remove(sPath);
        },

        async onAddButtonProductPress() {
          const aggregationBinding = this.getView()
            .byId('idProductsTable')
            .getBinding('items')
            .create({
              Name: '',
              Status: 'Storage',
              MadeIn: '',
              Rating: 2,
              Price_amount: '',
              Specs: 'Test',
              Store_ID: this._activeId,
            });
          this._oInlineRow = [...this._oInlineRow, aggregationBinding];
        },

        _CheckCreateProductsInput() {
          const createProductModel = this.getModel('createProduct');
          if (createProductModel) {
            const data = createProductModel.getData();
            if (data.Name || data.Status || data.MadeIn || data.Price_amount)
              return false;
          }
        },

        onInvokeImportFunctionButtonPress() {
          const oBundle = this.getModel('i18n').getResourceBundle();
          const oModel = this.getModel();

          oModel.callFunction('/mutate', {
            method: 'POST',
            urlParameters: {
              param: 'param',
            },
            success() {
              MessageToast.show(oBundle.getText('mutateExecuted'));
            },
          });
        },
      }
    );
  }
);
