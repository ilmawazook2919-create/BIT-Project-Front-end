import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { InstituteLoginComponent } from './component/institute-login/institute-login.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { AuthGuard } from './component/auth/auth.guard';
import { PrivilegeComponent } from './component/privilege/privilege.component';
import { PartComponent } from './component/part/part.component'
import { InventoryLevelComponent } from './component/inventory-level/inventory-level.component';
import { CategoryComponent } from './component/category/category.component';
import { CustomerComponent } from './component/customer/customer.component';
import { SupplierComponent } from './supplier/supplier.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { BinComponent } from './component/bin/bin.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderItemComponent } from './purchase-order-item/purchase-order-item.component';
import { GoodsReceivedNoteComponent } from './component/goods-received-note/goods-received-note.component';
import { GrnItemComponent } from './grn-item/grn-item.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesOrderItemComponent } from './sales-order-item/sales-order-item.component';



const routes: Routes = [
  
  {path : 'dashboard',component : DashboardComponent,canActivate:[AuthGuard], data:{roles:['admin','user']}},

  {path : 'login',component : InstituteLoginComponent},

  {path : 'forbidden',component : ForbiddenComponent},
  
  {path : 'privilege',component : PrivilegeComponent, canActivate:[AuthGuard], data:{roles:['admin','user']}},

  {path : 'part',component : PartComponent, canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'inventoryLevel',component : InventoryLevelComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'category',component : CategoryComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

   {path : 'customer',component : CustomerComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

   {path : 'supplier',component : SupplierComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'warehouse',component : WarehouseComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'bin',component : BinComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'purchaseOrderItem',component : PurchaseOrderItemComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'purchaseOrder',component : PurchaseOrderComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

  {path : 'goodsReceivedNote',component : GoodsReceivedNoteComponent,canActivate:[AuthGuard], data:{roles:['admin']}},
  
  {path : 'grnItem',component : GrnItemComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

   {path : 'salesOrder',component : SalesOrderComponent,canActivate:[AuthGuard], data:{roles:['admin']}},

   {path : 'salesOrderItem',component : SalesOrderItemComponent,canActivate:[AuthGuard], data:{roles:['admin']}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
