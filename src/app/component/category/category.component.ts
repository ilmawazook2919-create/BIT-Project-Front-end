import { Component } from '@angular/core';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { FormBuilder } from '@angular/forms';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import swal from 'sweetalert';
import { CategoryRepresentation } from '../services/api/module/category-representation';
import { CategoryService } from 'src/app/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
   deleteValue: string;
  editValue: string;
  insertValue: string;
  selectValue: string;

  updateBtn: boolean = false;

  index: any;
  type: string;
  roleName: any;
  allAccess: any;
  moduleId: string;
  categories: Array<any> = [];
  isEditCategory: boolean = false;
  roleNameForPrivilege: Array<any> = [];

  categoryObj: CategoryRepresentation = {};

  constructor(
    private categoryService: CategoryService,
    private privilegeService: PrivilegeService,
    private userAuthService: UserAuthService,
    public fb: FormBuilder
  ) { }
   ngOnInit(): void {
    this.isEditCategory = false;
    this.GetAllCategory();
    this.getprivilegeforComponent();
  }

  // Get Privileges
  getprivilegeforComponent(): void {

    this.roleNameForPrivilege = this.userAuthService.getRoles();

    if (this.roleNameForPrivilege != null) {
      for (let i = 0; i < this.roleNameForPrivilege.length; i++) {
        this.roleName = this.roleNameForPrivilege[i].roleName;
      }
    }
     this.moduleId = "3";

    this.privilegeService.GetAllPrivilegeForComponent(this.roleName, this.moduleId)
      .subscribe(allData => {

        this.allAccess = allData.data.dataList[0];

        this.deleteValue = allData.data.dataList[0].del;
        this.editValue = allData.data.dataList[0].upd;
        this.insertValue = allData.data.dataList[0].ins;
        this.selectValue = allData.data.dataList[0].sel;

        this.buttonDisable(
          this.deleteValue,
          this.editValue,
          this.insertValue,
          this.selectValue
        );
          });
  }

  // Disable Buttons
  buttonDisable(
    deleteValue: string,
    editValue: string,
    insertValue: string,
    selectValue: string
  ) {

    console.log(editValue);

    if (editValue == "0") {
      this.updateBtn = true;
    } else {
      this.updateBtn = false;
    }
      }

  // Save Category
  SaveCategory(): void {

    this.type = this.isEditCategory == false ? 'Add' : 'Update';

    if (this.type == 'Add') {

      swal({
        title: "Are you sure?",
        text: "That you want to Add this details?",
        icon: "warning",
        dangerMode: true,
      })
        .then(willDelete => {

          if (willDelete) {
             this.categoryService.createCategory(this.categoryObj, this.type)
              .subscribe({
                next: (result): void => {
                  this.GetAllCategory();
                }
              });

            swal("Successful!", "Category has been Added!", "success");
          }

        });

    } else {

      console.log(this.categoryObj);
         this.categoryService.createCategory(this.categoryObj, this.type)
        .subscribe({
          next: (result): void => {
            this.GetAllCategory();
          }
        });

      swal("Successful!", "Category has been updated!", "success");

    }
  }

  // Get Category By ID
  GetCategoryById(ID: any) {
 this.categoryService.GetCategoryById(ID).subscribe(allData => {

      this.categoryObj = allData.data.dataList[0];
      this.isEditCategory = true;

    });

  }

  // Delete Category
  DeleteCategoryById(ID: any) {

    swal({
       title: "Are you sure",
      text: "That you want to Delete this Category?",
      icon: "warning",
      dangerMode: true,
    })
      .then(willDelete => {

        if (willDelete) {

          swal("Deleted!", "Category has been deleted!", "success");

          this.categoryService.DeleteCategoryById(ID)
            .subscribe(allData => {

              this.GetAllCategory();

            });
               }

      });

  }

  // Get All Categories
  GetAllCategory() {

    this.categoryService.GetAllCategories()
      .subscribe(allData => {

        this.categories = allData.data.dataList;

      });

  } 

}
