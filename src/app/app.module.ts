import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './component/student/student.component';
import { CourseComponent } from './component/course/course.component';
import { TeacherComponent } from './component/teacher/teacher.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ClassComponent } from './component/class/class.component';
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


@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    CourseComponent,
    TeacherComponent,
    DashboardComponent,
    ClassComponent,
    ForbiddenComponent,
    InstituteLoginComponent,
    PrivilegeComponent,
    PartComponent,
    InventoryLevelComponent,
    CategoryComponent,
    CustomerComponent,
    SupplierComponent,
    WarehouseComponent,
    BinComponent
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
