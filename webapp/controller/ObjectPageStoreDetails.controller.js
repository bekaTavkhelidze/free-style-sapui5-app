sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/m/ColumnListItem',
    'sap/m/Input',
    'sap/m/Select',
    'sap/ui/core/Item',
    'sap/ui/model/json/JSONModel',
  ],
  (
    Controller,
    Filter,
    FilterOperator,
    MessageBox,
    MessageToast,
    ColumnListItem,
    Input,
    Select,
    Item,
    JSONModel
  ) => {
    'use strict';

    return Controller.extend(
      'freestylesapui5app.controller.ObjectPageStoreDetails',
      {
        _activeId: null,

        _oInlineRow: null,
        onInit() {
          const oRouter = this.getOwnerComponent().getRouter();

          oRouter
            .getRoute('ObjectPageStoreDetails')
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched(oEvent) {
          const sActiveId = oEvent.getParameter('arguments').id;

          this._activeId = sActiveId;
          const oData = this.getView().bindElement({
            path: "/Stores(guid'" + sActiveId + "' )",
            Parameters: { $expand: 'Products' },
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
          const oModel = this.getView().getModel();

          if (oModel.hasPendingChanges() || this._CheckCreateProductsInput) {
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
          const oModel = this.getView().getModel();

          if (oModel.hasPendingChanges() || this._CheckCreateProductsInput) {
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
          const oEditMode = this.getView().getModel('isEditModeActive');
          oEditMode.setProperty('/isEditModeActive', true);
        },

        onSaveButtonPress() {
          const oEditMode = this.getView().getModel('isEditModeActive');
          const oModel = this.getView().getModel();

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

          if (hasMissing) return;
          if (!this._validate()) return;

          oModel.submitChanges();

          oEditMode.setProperty('/isEditModeActive', false);
        },
        _validate() {
          const oData = this.getView().getBindingContext().getObject();

          const oValidationModel = this.getView().getModel('validation');
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
          const oModel = this.getView().getModel();

          oModel.resetChanges();
          this._cancelEdit();
        },

        _cancelEdit() {
          const oEditMode = this.getView().getModel('isEditModeActive');
          oEditMode.setProperty('/isEditModeActive', false);
        },

        onDeleteButtonProductPress() {
          const oTable = this.getView().byId('idProductsTable');
          const aSelectedProducts = oTable.getSelectedItem();
          const sPath = aSelectedProducts.getBindingContext().getPath();

          const oModel = this.getView().getModel();

          oModel.remove(sPath);
        },

        async onAddButtonProductPress() {
          const isCreateModeActive =
            this.getOwnerComponent().getModel('isCreateModeActive');
          isCreateModeActive.setProperty('/isCreateModeActive', true);

          const oBundle = this.getView().getModel('i18n').getResourceBundle();

          const oContext = new JSONModel({
            Name: '',
            Status: '',
            MadeIn: '',
            Rating: 2,
            Price_amount: '',
            Specs: 'Test',
            Store_ID: this._activeId,
          });
          this.getView().setModel(oContext, 'createProduct');

          const oSelect = new Select({
            selectedKey: '{createProduct>/Status}',

            items: [
              new Item({ key: '', text: oBundle.getText('selectStatus') }),
              new Item({ key: 'OK', text: oBundle.getText('ok') }),
              new Item({ key: 'STORAGE', text: oBundle.getText('storage') }),
              new Item({
                key: 'OUT_OF_STOCK',
                text: oBundle.getText('outOfStock'),
              }),
            ],
          });

          const oInlineItemForm = new ColumnListItem({
            cells: [
              new Input({ value: '{createProduct>/MadeIn}' }),
              new Input({ value: '{createProduct>/Name}' }),
              oSelect,
              new Input({ value: '{createProduct>/Price_amount}' }),
            ],
          });
          this._oInlineRow = oInlineItemForm;

          const oTable = this.byId('idProductsTable');
          oTable.insertItem(oInlineItemForm, 0);
        },
        onCancelButtonCreateProductPress: function () {
          const oInlineRow = this._oInlineRow;

          const oTable = this.byId('idProductsTable');
          const isCreateModeActive =
            this.getOwnerComponent().getModel('isCreateModeActive');
          const oCreateModel = this.getView().getModel('createProduct');

          if (oInlineRow) {
            oTable.removeItem(oInlineRow);
            oInlineRow.destroy();
            this._oInlineRow = null;
          }

          isCreateModeActive.setProperty('/isCreateModeActive', false);

          if (oCreateModel) {
            oCreateModel.setData({
              Name: '',
              Status: '',
              MadeIn: '',
              Rating: '',
              Price_amount: '',
              Specs: 'Test',
              Store_ID: this._activeId,
            });
          }
        },

        onSaveButtonProductPress() {
          const data = this.getView().getModel('createProduct').getData();
          const oBundle = this.getView().getModel('i18n').getResourceBundle();
          const oInlineRow = this._oInlineRow;
          if (!data.Name || !data.Status || !data.MadeIn || !data.Price_amount)
            return;
          const oModel = this.getView().getModel();

          oModel.create('/Products', data, {
            success: () => {
              if (oInlineRow) {
                this.onCancelButtonCreateProductPress();
              }
              oModel.refresh(true);
              MessageToast.show(oBundle.getText('productSuccessAdd'));
            },
          });
        },

        _CheckCreateProductsInput() {
          const data = this.getView().getModel('createProduct').getData();
          if (data.Name || data.Status || data.MadeIn || data.Price_amount)
            return false;
        },

        onInvokeImportFunctionButtonPress() {
          const oBundle = this.getView().getModel('i18n').getResourceBundle();
          const oModel = this.getView().getModel();

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
