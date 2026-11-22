import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { AuthGuard } from './component/auth/auth.guard';
import { AuthInterceptor } from './component/auth/auth.interceptor';
import { InstituteLoginComponent } from './component/institute-login/institute-login.component';
import { PrivilegeComponent } from './component/privilege/privilege.component';
import { PartComponent } from './component/part/part.component';
import { InventoryLevelComponent } from './component/inventory-level/inventory-level.component';
import { CategoryComponent } from './component/category/category.component';
import { CustomerComponent } from './component/customer/customer.component';
import { SupplierComponent } from './supplier/supplier.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { BinComponent } from './component/bin/bin.component';
import { PurchaseOrderItemComponent } from './purchase-order-item/purchase-order-item.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { GoodsReceivedNoteComponent } from './component/goods-received-note/goods-received-note.component';
import { GrnItemComponent } from './grn-item/grn-item.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesOrderItemComponent } from './sales-order-item/sales-order-item.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ForbiddenComponent,
    InstituteLoginComponent,
    PrivilegeComponent,
    PartComponent,
    InventoryLevelComponent,
    CategoryComponent,
    CustomerComponent,
    SupplierComponent,
    WarehouseComponent,
    BinComponent,
    PurchaseOrderItemComponent,
    PurchaseOrderComponent,
    GoodsReceivedNoteComponent,
    GrnItemComponent,
    SalesOrderComponent,
    SalesOrderItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
