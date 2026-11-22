import { Component } from '@angular/core';
import { SalesOrderService } from '../sales-order.service';
import { FormBuilder } from '@angular/forms';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import swal from 'sweetalert';
import { SalesOrderRepresentation } from '../component/services/api/module/salesOrder-representation';
@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent {
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
    salesOrders: Array<any> = [];
    isEditSalesOrder: boolean = false; 
    roleNameForPrivilege: Array<any> = [];
    salesOrderObj:SalesOrderRepresentation= {};

        constructor(
        private salesOrderService: SalesOrderService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        public fb: FormBuilder
      ) {}

    ngOnInit(): void {
    this.isEditSalesOrder= false;
    this.GetAllSalesOrder();
    this.getprivilegeforComponent();
    
}

getprivilegeforComponent():void{

  this.roleNameForPrivilege =  this.userAuthService.getRoles();

      if(this.roleNameForPrivilege!=null){
      for(let i = 0 ; i<this.roleNameForPrivilege.length; i++){
        this.roleName = this.roleNameForPrivilege[i].roleName;
        }
  }

    this.moduleId = "13";
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

SaveSalesOrder():void{
  this.type = this.isEditSalesOrder==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.salesOrderService.createSalesOrder(this.salesOrderObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllSalesOrder();  
            }
          });
          swal("Sucessfull!", "SalesOrder has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.salesOrderObj);
      
      this.salesOrderService.createSalesOrder(this.salesOrderObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllSalesOrder();  
            }
          });
      swal("Sucessfull!", " SalesOrder has been updated!", "success");

  
    }
}

GetSalesOrderById(ID:any){
  this.salesOrderService.GetSalesOrderById(ID).subscribe(allData=>{ 
    this.salesOrderObj = allData.data.dataList[0];
    this.isEditSalesOrder = true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this SalesOrder?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "SalesOrder has been deleted!", "success");
      this.salesOrderService.DeleteSalesOrderById(ID).subscribe(allData=>{
        this.GetAllSalesOrder();
      })
    }
  });
}

GetAllSalesOrder(){
  this.salesOrderService.GetAllSalesOrders().subscribe(allData=>{
    this.salesOrders= allData.data.dataList; 
    this.salesOrders.forEach(salesOrder => {
  console.log('salesOrder status:',salesOrder.status);
});
    
    console.log('dataobj ',this.salesOrders)
  });
 
}

}





















