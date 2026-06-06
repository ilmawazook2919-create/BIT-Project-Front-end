import { Component } from '@angular/core';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-purchase-order-item',
  templateUrl: './purchase-order-item.component.html',
  styleUrls: ['./purchase-order-item.component.scss']
})
export class PurchaseOrderItemComponent {
   deleteValue:string;
  editValue:string;
  insertValue:string;
  selectValue:string;

  updateBtn:boolean=false;

  index:any;
  type:string;
  roleName:any;
  allAccess:any;
  moduleId:string;
  PurchaseOrderItems: Array<any> = [];
  isEditPurchaseOrderItem: boolean = false; 
  roleNameForPrivilege: Array<any> = [];
  purchaseOrderItemObj:PurchaseOrderItemRepresentation = {};
   constructor(
     private purchaseOrderItemService: PurchaseOrderItemService,
     private privilegeService: PrivilegeService,
     private userAuthService: UserAuthService,
     public fb: FormBuilder) {}
        ngOnInit(): void {
    this.isEditPurchaseOrderItem = false;
    this.GetAllInventoryLevel();
    this.getprivilegeforComponent();

}

getprivilegeforComponent():void{

  this.roleNameForPrivilege =  this.userAuthService.getRoles();

      if(this.roleNameForPrivilege!=null){
      for(let i = 0 ; i<this.roleNameForPrivilege.length; i++){
        this.roleName = this.roleNameForPrivilege[i].roleName;
        }
  }

    this.moduleId = "2";
    this.privilegeService.GetAllPrivilegeForComponent(this.roleName,this.moduleId).subscribe(allData=>{ 
    this.allAccess = allData.data.dataList[0];
    
    this.deleteValue=allData.data.dataList[0].del;
    this.editValue=allData.data.dataList[0].upd;
    this.insertValue=allData.data.dataList[0].ins;
    this.selectValue=allData.data.dataList[0].sel;

    this.buttonDisable(this.deleteValue,this.editValue,this.insertValue,this.selectValue);
  })
 
}

buttonDisable(deleteValue:string,editValue:string,insertValue:string,selectValue:string){
console.log(editValue);

    if(editValue=="0"){
      this.updateBtn=true;
    }else{
      this.updateBtn=false;
    }

}

SavePurchaseOrderItem():void{
  this.type = this.isEditPurchaseOrderItem==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.purchaseOrderItemService.createPurchaseOrderItem(this.purchaseOrderItemObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllPurchaseOrderItem();  
            }
          });
          swal("Sucessfull!", "PurchaseOrderItem has been Added!", "success");
        }
       
      });
    }else{
      console.log(this.purchaseOrderItemObj);
      
      this.purchaseOrderItemService.createPurchaseOrderItem(this.purchaseOrderItemObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllPurchaseOrderItem();  
            }
          });
      swal("Sucessfull!", "PurchaseOrderItem has been updated!", "success");

  
    }
}

GetPurchaseOrderItemById(ID:any){
  this.purchaseOrderItemService.GetPurchaseOrderItemById(ID).subscribe(allData=>{ 
    this.purchaseOrderItemObj = allData.data.dataList[0];
    this.isEditPurchaseOrderItem= true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this PurchaseOrderItem?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "PurchaseOrderItem has been deleted!", "success");
      this.purchaseOrderItemService.DeletePurchaseOrderItemById(ID).subscribe(allData=>{
        this.GetAllPurchaseOrderItem();
      })
    }
  });
}

GetAllPurchaseOrderItem(){
  this.purchaseOrderItemService.GetAllPurchaseOrderItems().subscribe(allData=>{
    this.PurchaseOrderItems= allData.data.dataList; 
  });
}

}





