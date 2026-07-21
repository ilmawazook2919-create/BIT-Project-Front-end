import { Component } from '@angular/core';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { FormBuilder } from '@angular/forms';
import { UserAuthService } from '../services/api/user/user-auth.service';
import swal from 'sweetalert';
import { GoodsReceivedNoteRepresentation } from '../services/api/module/goods-received-note-representation';
import { GoodsReceivedNoteService } from 'src/app/goods-received-note.service';

@Component({
  selector: 'app-goods-received-note',
  templateUrl: './goods-received-note.component.html',
  styleUrls: ['./goods-received-note.component.scss']
})
export class GoodsReceivedNoteComponent {
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
    goodsReceivedNotes: Array<any> = [];
    isEditGoodsReceivedNote: boolean = false; 
    roleNameForPrivilege: Array<any> = [];
    grnObj:GoodsReceivedNoteRepresentation= {};

        constructor(
        private goodsReceivedNoteService: GoodsReceivedNoteService,
        private privilegeService: PrivilegeService,
        private userAuthService: UserAuthService,
        public fb: FormBuilder
      ) {}

    ngOnInit(): void {
    this.isEditGoodsReceivedNote = false;
    this.GetAllGoodsReceivedNote();
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

SaveGoodsReceivedNote():void{
  this.type = this.isEditGoodsReceivedNote==false?'Add':'Update';
    if(this.type=='Add'){
      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.goodsReceivedNoteService.createGoodsReceivedNotee(this.grnObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllGoodsReceivedNote();  
            }
          });
          swal("Sucessfull!", "GoodsReceivedNote has been Addedd!", "success");
        }
       
      });
    }else{
      console.log(this.grnObj);
      
      this.goodsReceivedNoteService.createGoodsReceivedNotee(this.grnObj,this.type)
          .subscribe({
            next:(result):void=>{
              this.GetAllGoodsReceivedNote();  
            }
          });
      swal("Sucessfull!", " GoodsReceivedNote has been updated!", "success");

  
    }
}

GetGoodsReceivedNoteById(ID:any){
  this.goodsReceivedNoteService.GetGoodsReceivedNoteById(ID).subscribe(allData=>{ 
    this.grnObj = allData.data.dataList[0];
    this.isEditGoodsReceivedNote = true;
  })
}

DeleteById(ID:any){
  swal({
    title: "Are you sure",
    text: "That you want to Delete this GoodsReceivedNote?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "GoodsReceivedNote has been deleted!", "success");
      this.goodsReceivedNoteService.DeleteGoodsReceivedNoteById(ID).subscribe(allData=>{
        this.GetAllGoodsReceivedNote();
      })
    }
  });
}

GetAllGoodsReceivedNote(){
  this.goodsReceivedNoteService.GetAllGoodsReceivedNotes().subscribe(allData=>{
    this.goodsReceivedNotes = allData.data.dataList; 
    this.goodsReceivedNotes.forEach(goodsReceivedNote => {
  console.log('goodsReceivedNote status:',goodsReceivedNote.status);
});
    
    console.log('dataobj ',this.goodsReceivedNotes)
  });
 
}

}
















