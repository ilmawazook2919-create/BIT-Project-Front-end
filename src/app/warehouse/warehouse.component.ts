import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import swal from 'sweetalert';
import { WarehouseRepresentation } from '../component/services/api/module/warehouse-representation';
import { WarehouseService } from '../warehouse.service';
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent {
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
    warehouses: Array<any> = [];
    isEditWarehouse: boolean = false; 
    roleNameForPrivilege: Array<any> = [];
    warehouseObj:WarehouseRepresentation = {};

        constructor(
        private warehouseService: WarehouseService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        public fb: FormBuilder
      ) {}

    ngOnInit(): void {
    this.isEditWarehouse = false;
    this.GetAllWarehouse();
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

SaveWarehouse():void{
  this.type = this.isEditWarehouse==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.warehouseService.createWarehouse(this.warehouseObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllWarehouse();  
            }
          });
          swal("Sucessfull!", "Warehouse has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.warehouseObj);
      
      this.warehouseService.createWarehouse(this.warehouseObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllWarehouse();  
            }
          });
      swal("Sucessfull!", " Warehouse has been updated!", "success");

  
    }
}

GetWarehouseById(ID:any){
  this.warehouseService.GetWarehouseById(ID).subscribe(allData=>{ 
    this.warehouseObj = allData.data.dataList[0];
    this.isEditWarehouse = true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this Warehouse?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "Warehouse has been deleted!", "success");
      this.warehouseService.DeleteWarehouseById(ID).subscribe(allData=>{
        this.GetAllWarehouse();
      })
    }
  });
}

GetAllWarehouse(){
  this.warehouseService.GetAllWarehouses().subscribe(allData=>{
    this.warehouses = allData.data.dataList; 
    this.warehouses.forEach(warehouse => {
  console.log('Warehouse status:',warehouse.status);
});
    
    console.log('dataobj ',this.warehouses)
  });
 
}

}










