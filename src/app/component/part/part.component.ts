import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert';
import { PartRepresentation } from '../services/api/module/part-representation';
import { PartService } from '../../part.service';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { ListPage } from '../../list-page';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})

export class PartComponent {
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
      parts: Array<any> = [];
      isEditPart: boolean = false; 
      roleNameForPrivilege: Array<any> = [];
      partObj:PartRepresentation = {};
      pager = new ListPage();
      modalRef: any;
        constructor(
        private partService: PartService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        private modalService: NgbModal,
        public fb: FormBuilder
      ) {}
      
        ngOnInit(): void {
    this.isEditPart = false;
    this.GetAllPart();
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

SavePart():void{
  this.type = this.isEditPart==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.partService.createPart(this.partObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.closeForm();
              this.GetAllPart();  
            }
          });
          swal("Sucessfull!", "Part has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.partObj);
      
      this.partService.createPart(this.partObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.closeForm();
              this.GetAllPart();  
            }
          });
      swal("Sucessfull!", "Part has been updated!", "success");

  
    }
}

GetPartById(ID:any){
  this.partService.GetPartById(ID).subscribe(allData=>{ 
    this.partObj = allData.data.dataList[0];
    this.isEditPart = true;
  })
}

openCreate(content: any): void {
  this.isEditPart = false;
  this.partObj = {};
  this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static', scrollable: true });
}

openEdit(ID: any, content: any): void {
  this.partService.GetPartById(ID).subscribe(allData => {
    this.partObj = allData.data.dataList[0];
    this.isEditPart = true;
    this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static', scrollable: true });
  });
}

closeForm(): void {
  if (this.modalRef) {
    this.modalRef.close();
    this.modalRef = null;
  }
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this Part?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "Part has been deleted!", "success");
      this.partService.DeletePartById(ID).subscribe(allData=>{
        this.GetAllPart();
      })
    }
  });
}

  GetAllPart() {

    this.partService.GetAllParts()
      .subscribe(allData => {

        this.parts = allData.data.dataList;
      
      });

  } 

}







