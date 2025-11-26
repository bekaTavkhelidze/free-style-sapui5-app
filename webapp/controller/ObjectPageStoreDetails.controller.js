sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
  ],
  (Controller, Filter, FilterOperator, MessageBox, MessageToast) => {
    'use strict';

    return Controller.extend(
      'freestylesapui5app.controller.ObjectPageStoreDetails',
      {
        _activeId: null,
        _oDialog: null,
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

          if (oModel.hasPendingChanges()) {
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

          if (oModel.hasPendingChanges()) {
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
          this._oDialog ??= await this.loadFragment({
            name: 'freestylesapui5app.fragments.CreateProductDialog',
          });
          this.getView().addDependent(this._oDialog);
          const oModel = this.getView().getModel();

          const oContext = oModel.createEntry('/Products', {
            properties: {
              Name: '',
              Status: '231',
              MadeIn: '',
              Rating: null,
              Price_amount: '',
              Specs: 'Test',
              Store_ID: this._activeId,
            },
          });
          this.byId('idCreateProductDialog').bindElement(oContext.getPath());

          const oDataContext = this._oDialog.open();
        },

        onCreateButtonProductPress() {
          const {
            Name,
            Status,
            MadeIn,
            Rating,
            Price_amount,
            Store_ID,
            Specs,
          } = this.byId('idCreateProductDialog')
            .getBindingContext()
            .getObject();
          freestylesapui5app.controller.ObjectPageStoreDetail;
          if (!Name || !Status || !MadeIn || !Rating || !Price_amount) return;
          const oModel = this.getView().getModel();

          oModel.submitChanges();
          this._oDialog.close();
        },
        onCancelButtonProductPress() {
          this._oDialog.close();
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
