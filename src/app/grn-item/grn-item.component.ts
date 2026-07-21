import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { GrnItemService } from '../grn-item.service';
import { GrnItemRepresentation } from '../component/services/api/module/grn-item-representation';
import swal from 'sweetalert';
@Component({
  selector: 'app-grn-item',
  templateUrl: './grn-item.component.html',
  styleUrls: ['./grn-item.component.scss']
})
export class GrnItemComponent {
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
    grnItems: Array<any> = [];
    isEditGrnItem: boolean = false; 
    roleNameForPrivilege: Array<any> = [];
    grnItemObj:GrnItemRepresentation= {};

        constructor(
        private grnItemService: GrnItemService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        public fb: FormBuilder
      ) {}

    ngOnInit(): void {
    this.isEditGrnItem= false;
    this.GetAllGrnItem();
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

SaveGrnItem():void{
  this.type = this.isEditGrnItem==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.grnItemService.createGrnItem(this.grnItemObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllGrnItem();  
            }
          });
          swal("Sucessfull!", "GrnItem has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.grnItemObj);
      
      this.grnItemService.createGrnItem(this.grnItemObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllGrnItem();  
            }
          });
      swal("Sucessfull!", " GrnItem has been updated!", "success");

  
    }
}

GetGrnItemById(ID:any){
  this.grnItemService.GetGrnItemById(ID).subscribe(allData=>{ 
    this.grnItemObj = allData.data.dataList[0];
    this.isEditGrnItem = true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this GrnItem?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "GrnItem has been deleted!", "success");
      this.grnItemService.DeleteGrnItemById(ID).subscribe(allData=>{
        this.GetAllGrnItem();
      })
    }
  });
}

GetAllGrnItem(){
  this.grnItemService.GetAllGrnItems().subscribe(allData=>{
    this.grnItems= allData.data.dataList; 
    this.grnItems.forEach(grnItem => {
  console.log('grnItem status:',grnItem.status);
});
    
    console.log('dataobj ',this.grnItems)
  });
 
}

}



















