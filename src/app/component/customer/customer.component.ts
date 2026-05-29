import { Component } from '@angular/core';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { FormBuilder } from '@angular/forms';
import { CustomerService } from '../../customer.service';
import { CustomerRepresentation } from '../services/api/module/customer-representation';
import swal from 'sweetalert';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
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
      customers: Array<any> = [];
      isEditCustomer: boolean = false; 
      roleNameForPrivilege: Array<any> = [];
      customerObj:CustomerRepresentation = {};
        constructor(
        private customerService: CustomerService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        public fb: FormBuilder
      ) {}
        ngOnInit(): void {
    this.isEditCustomer = false;
    this.GetAllCustomer();
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

SaveCustomer():void{
  this.type = this.isEditCustomer==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.customerService.createCustomer(this.customerObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllCustomer();  
            }
          });
          swal("Sucessfull!", "Customer has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.customerObj);
      
      this.customerService.createCustomer(this.customerObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllCustomer();  
            }
          });
      swal("Sucessfull!", "Customer has been updated!", "success");

  
    }
}

GetCustomerById(ID:any){
  this.customerService.GetCustomerById(ID).subscribe(allData=>{ 
    this.customerObj = allData.data.dataList[0];
    this.isEditCustomer = true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this Customer?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "Customer has been deleted!", "success");
      this.customerService.DeleteCustomerById(ID).subscribe(allData=>{
        this.GetAllCustomer();
      })
    }
  });
}

GetAllCustomer(){
  this.customerService.GetAllCustomers().subscribe(allData=>{
    this.customers = allData.data.dataList; 
    this.customers.forEach(customer => {
  console.log('Customer status:', customer.status);
});
    
    console.log('dataobj ',this.customers)
  });
 
}

}




