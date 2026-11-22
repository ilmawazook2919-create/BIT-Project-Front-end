import { Component } from '@angular/core';
import { SalesOrderItemRepresentation } from '../component/services/api/module/salesOrder-item-representation';
import { SalesOrderItemService } from '../sales-order-item.service';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-sales-order-item',
  templateUrl: './sales-order-item.component.html',
  styleUrls: ['./sales-order-item.component.scss']
})
export class SalesOrderItemComponent {

  deleteValue: string;
    editValue: string;
    insertValue: string;
    selectValue: string;

    updateBtn: boolean = false;
    
    index: any;
    type: string;
    roleName: any;
    allAccess: any;
    moduleId: string;
    salesOrderItems: Array<any> = [];
    isEditSalesOrderItem: boolean = false; 
    roleNameForPrivilege: Array<any> = [];
    salesOrderItemObj: SalesOrderItemRepresentation = {};

    constructor(
      private salesOrderItemService: SalesOrderItemService,
      private privilegeService: PrivilegeService,
      private userAuthService: UserAuthService,
      public fb: FormBuilder
    ) {}

    ngOnInit(): void {
      this.isEditSalesOrderItem = false;
      this.GetAllSalesOrderItems();
      this.getprivilegeforComponent();
    }

    getprivilegeforComponent(): void {
      this.roleNameForPrivilege = this.userAuthService.getRoles();

      if (this.roleNameForPrivilege != null) {
        for (let i = 0; i < this.roleNameForPrivilege.length; i++) {
          this.roleName = this.roleNameForPrivilege[i].roleName;
        }
      }

      this.moduleId = "14";
      this.privilegeService.GetAllPrivilegeForComponent(this.roleName, this.moduleId).subscribe(allData => { 
        this.allAccess = allData.data.dataList[0];
        
        this.deleteValue = allData.data.dataList[0].del;
        this.editValue = allData.data.dataList[0].upd;
        this.insertValue = allData.data.dataList[0].ins;
        this.selectValue = allData.data.dataList[0].sel;

        this.buttonDisable(this.deleteValue, this.editValue, this.insertValue, this.selectValue);
      });
    }

    buttonDisable(deleteValue: string, editValue: string, insertValue: string, selectValue: string) {
      if (editValue == "0") {
        this.updateBtn = true;
      } else {
        this.updateBtn = false;
      }
    }

    SaveSalesOrderItem(): void {
      this.type = this.isEditSalesOrderItem == false ? 'Add' : 'Update';
      if (this.type == 'Add') {
        swal({
          title: "Are you sure?",
          text: "That you want to Add this details?",
          icon: "warning",
          dangerMode: true,
        })
        .then(willDelete => {
          if (willDelete) {
            this.salesOrderItemService.createSalesOrderItem(this.salesOrderItemObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllSalesOrderItems();  
              }
            });
            swal("Sucessfull!", "SalesOrderItem has been Added!", "success");
          }
        });
      } else {
        console.log(this.salesOrderItemObj);
        
        this.salesOrderItemService.createSalesOrderItem(this.salesOrderItemObj, this.type)
          .subscribe({
            next: (result): void => {
              this.GetAllSalesOrderItems();  
            }
          });
        swal("Sucessfull!", "SalesOrderItem has been updated!", "success");
      }
    }

    GetSalesOrderItemById(ID: any) {
      this.salesOrderItemService.GetSalesOrderItemById(ID).subscribe(allData => { 
        this.salesOrderItemObj = allData.data.dataList[0];
        this.isEditSalesOrderItem = true;
      });
    }

    DeleteById(ID: any) {
      swal({
        title: "Are you sure",
        text: "That you want to Delete this SalesOrderItem?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          swal("Deleted!", "SalesOrderItem has been deleted!", "success");
          this.salesOrderItemService.DeleteSalesOrderItemById(ID).subscribe(allData => {
            this.GetAllSalesOrderItems();
          });
        }
      });
    }

    GetAllSalesOrderItems() {
      this.salesOrderItemService.GetAllSalesOrderItems().subscribe(allData => {
        this.salesOrderItems = allData.data.dataList; 
        this.salesOrderItems.forEach(salesOrderItem => {
          console.log('salesOrderItem status:', salesOrderItem.status);
        });
        console.log('dataobj ', this.salesOrderItems);
      });
    }
}
