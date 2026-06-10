import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { PurchaseOrderRepresentation } from '../component/services/api/module/purchaseOrder-representation';
import { PurchaseOrderService } from '../purchase-order.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent {
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
  purchaseOrders: Array<any> = [];
  isEditPurchaseOrder: boolean = false;
  roleNameForPrivilege: Array<any> = [];

  purchaseOrderObj: PurchaseOrderRepresentation = {};

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private privilegeService: PrivilegeService,
    private userAuthService: UserAuthService,
    public fb: FormBuilder
  ) { }
   ngOnInit(): void {
    this.isEditPurchaseOrder = false;
    this.GetAllPurchaseOrder();
    this.getprivilegeforComponent();
  }

  // Get Privileges
  getprivilegeforComponent(): void {

    this.roleNameForPrivilege = this.userAuthService.getRoles();

    if (this.roleNameForPrivilege != null) {
      for (let i = 0; i < this.roleNameForPrivilege.length; i++) {
        this.roleName = this.roleNameForPrivilege[i].roleName;
      }
    }
     this.moduleId = "6";

    this.privilegeService.GetAllPrivilegeForComponent(this.roleName, this.moduleId)
      .subscribe(allData => {

        this.allAccess = allData.data.dataList[0];

        this.deleteValue = allData.data.dataList[0].del;
        this.editValue = allData.data.dataList[0].upd;
        this.insertValue = allData.data.dataList[0].ins;
        this.selectValue = allData.data.dataList[0].sel;

        this.buttonDisable(
          this.deleteValue,
          this.editValue,
          this.insertValue,
          this.selectValue
        );
          });
  }

  // Disable Buttons
  buttonDisable(
    deleteValue: string,
    editValue: string,
    insertValue: string,
    selectValue: string
  ) {

    console.log(editValue);

    if (editValue == "0") {
      this.updateBtn = true;
    } else {
      this.updateBtn = false;
    }
      }

  // Save PurchaseOrder
  SavePurchaseOrder(): void {

    this.type = this.isEditPurchaseOrder == false ? 'Add' : 'Update';

    if (this.type == 'Add') {

      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
        .then(willDelete => {

          if (willDelete) {
             this.purchaseOrderService.createPurchaseOrder(this.purchaseOrderObj, this.type)
              .subscribe({
                next: (result): void => {
                  this.GetAllPurchaseOrder();
                }
              });

            swal("Successful!", "PurchaseOrder has been Added!", "success");
          }

        });

    } else {

      console.log(this.purchaseOrderObj);
         this.purchaseOrderService.createPurchaseOrder(this.purchaseOrderObj, this.type)
        .subscribe({
          next: (result): void => {
            this.GetAllPurchaseOrder();
          }
        });

      swal("Successful!", "PurchaseOrder has been updated!", "success");

    }
  }

  // Get PurchaseOrder By ID
  GetPurchaseOrderById(ID: any) {
 this.purchaseOrderService.GetPurchaseOrderById(ID).subscribe(allData => {

      this.purchaseOrderObj = allData.data.dataList[0];
      this.isEditPurchaseOrder= true;

    });

  }

  // Delete purchaseOrder
  DeletePurchaseOrderById(ID: any) {

    swal({
       title: "Are you sure",
      text: "That you want to Delete this purchaseOrder?",
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {

        if (willDelete) {

          swal("Deleted!", "PurchaseOrder has been deleted!", "success");

          this.purchaseOrderService.DeletepurchaseOrderById(ID)
            .subscribe(allData => {

              this.GetAllPurchaseOrder();

            });
               }

      });

  }

  // Get All purchaseOrders
  GetAllPurchaseOrder() {

    this.purchaseOrderService.GetAllPurchaseOrders()
      .subscribe(allData => {

        this.purchaseOrders = allData.data.dataList;

      });

  } 

}


