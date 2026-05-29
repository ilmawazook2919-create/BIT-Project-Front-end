import { Component } from '@angular/core';
import { SupplierRepresentation } from '../component/services/api/module/supplier-representation';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { FormBuilder } from '@angular/forms';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { SupplierService } from '../supplier.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})

export class SupplierComponent {
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
    suppliers: Array<any> = [];
    isEditSupplier: boolean = false; 
    roleNameForPrivilege: Array<any> = [];
    supplierObj:SupplierRepresentation = {};

        constructor(
        private supplierService: SupplierService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        public fb: FormBuilder
      ) {}

    ngOnInit(): void {
    this.isEditSupplier = false;
    this.GetAllSupplier();
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

SaveSupplier():void{
  this.type = this.isEditSupplier==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.supplierService.createSupplier(this.supplierObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllSupplier();  
            }
          });
          swal("Sucessfull!", "Supplier has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.supplierObj);
      
      this.supplierService.createSupplier(this.supplierObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllSupplier();  
            }
          });
      swal("Sucessfull!", "Supplier has been updated!", "success");

  
    }
}

GetSupplierById(ID:any){
  this.supplierService.GetSupplierById(ID).subscribe(allData=>{ 
    this.supplierObj = allData.data.dataList[0];
    this.isEditSupplier = true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this Supplier?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "Supplier has been deleted!", "success");
      this.supplierService.DeleteSupplierById(ID).subscribe(allData=>{
        this.GetAllSupplier();
      })
    }
  });
}

GetAllSupplier(){
  this.supplierService.GetAllSuppliers().subscribe(allData=>{
    this.suppliers = allData.data.dataList; 
    this.suppliers.forEach(supplier => {
  console.log('Supplier status:', supplier.status);
});
    
    console.log('dataobj ',this.suppliers)
  });
 
}

}







