import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { BinRepresentation } from '../services/api/module/bin-representation';
import { BinService } from 'src/app/bin.service';
import swal from 'sweetalert';
import { ListPage } from 'src/app/list-page';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss']
})
export class BinComponent {
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
    bins: Array<any> = [];
    isEditBin: boolean = false; 
    roleNameForPrivilege: Array<any> = [];
    binObj:BinRepresentation = {};
    pager = new ListPage();
    modalRef: any;

        constructor(
        private binService: BinService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        private modalService: NgbModal,
        public fb: FormBuilder
      ) {}

    ngOnInit(): void {
    this.isEditBin = false;
    this.GetAllBin();
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

SaveBin():void{
  this.type = this.isEditBin==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.binService.createBin(this.binObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.closeForm();
              this.GetAllBin();  
            }
          });
          swal("Sucessfull!", "Bin has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.binObj);
      
      this.binService.createBin(this.binObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.closeForm();
              this.GetAllBin();  
            }
          });
      swal("Sucessfull!", " Bin has been updated!", "success");

  
    }
}

GetBinById(ID:any){
  this.binService.GetBinById(ID).subscribe(allData=>{ 
    this.binObj = allData.data.dataList[0];
    this.isEditBin = true;
  })
}

openCreate(content: any): void {
  this.isEditBin = false;
  this.binObj = {};
  this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static', scrollable: true });
}

openEdit(ID: any, content: any): void {
  this.binService.GetBinById(ID).subscribe(allData => {
    this.binObj = allData.data.dataList[0];
    this.isEditBin = true;
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
    text: "That you want to Delete this Bin?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "Bin has been deleted!", "success");
      this.binService.DeleteBinById(ID).subscribe(allData=>{
        this.GetAllBin();
      })
    }
  });
}

GetAllBin(){
  this.binService.GetAllBins().subscribe(allData=>{
    this.bins = allData.data.dataList; 
    this.bins.forEach(bin => {
  console.log('bin status:',bin.status);
});
    
    console.log('dataobj ',this.bins)
  });
 
}

}













