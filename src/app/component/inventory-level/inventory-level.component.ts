import { Component } from '@angular/core';
import { InventoryLevelRepresentation } from '../services/api/module/inventory-level-representation';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { FormBuilder } from '@angular/forms';
import { InventoryLevelService } from 'src/app/inventory-level.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-inventory-level',
  templateUrl:'./inventory-level.component.html',
  styleUrls: ['./inventory-level.component.scss']
})
export class InventoryLevelComponent {
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
  InventoryLevels: Array<any> = [];
  isEditInventoryLevel: boolean = false; 
  roleNameForPrivilege: Array<any> = [];
  inventoryLevelObj:InventoryLevelRepresentation = {};
   constructor(
     private inventoryLevelService: InventoryLevelService,
     private privilegeService: PrivilegeService,
     private userAuthService: UserAuthService,
     public fb: FormBuilder) {}
        ngOnInit(): void {
    this.isEditInventoryLevel = false;
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

SaveInventoryLevel():void{
  this.type = this.isEditInventoryLevel==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.inventoryLevelService.createInventoryLevel(this.inventoryLevelObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllInventoryLevel();  
            }
          });
          swal("Sucessfull!", "InventoryLevel has been Added!", "success");
        }
       
      });
    }else{
      console.log(this.inventoryLevelObj);
      
      this.inventoryLevelService.createInventoryLevel(this.inventoryLevelObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllInventoryLevel();  
            }
          });
      swal("Sucessfull!", "InventoryLevel has been updated!", "success");

  
    }
}

GetInventoryLevelById(ID:any){
  this.inventoryLevelService.GetInventoryLevelById(ID).subscribe(allData=>{ 
    this.inventoryLevelObj = allData.data.dataList[0];
    this.isEditInventoryLevel = true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this InventoryLevel?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "InventoryLevel has been deleted!", "success");
      this.inventoryLevelService.DeleteInventoryLevelById(ID).subscribe(allData=>{
        this.GetAllInventoryLevel();
      })
    }
  });
}

GetAllInventoryLevel(){
  this.inventoryLevelService.GetAllInventoryLevels().subscribe(allData=>{
    this.InventoryLevels= allData.data.dataList; 
  });
}

}


