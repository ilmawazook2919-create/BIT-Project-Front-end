import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { InventoryLevelService } from 'src/app/inventory-level.service';
import { PartService } from 'src/app/part.service';
import { BinService } from 'src/app/bin.service';
import { StatusService } from '../services/api/status/status.service';
import { ListPage } from 'src/app/list-page';

@Component({
  selector: 'app-inventory-level',
  templateUrl: './inventory-level.component.html',
  styleUrls: ['./inventory-level.component.scss']
})
export class InventoryLevelComponent {
  deleteValue: string;
  editValue: string;
  insertValue: string;
  selectValue: string;
  updateBtn: boolean = false;
  saving: boolean = false;

  type: string;
  roleName: any;
  moduleId: string;
  InventoryLevels: Array<any> = [];
  parts: Array<any> = [];
  bins: Array<any> = [];
  statuses: Array<any> = [];
  searchText: string = '';
  pager = new ListPage();
  isEditInventoryLevel: boolean = false;
  roleNameForPrivilege: Array<any> = [];
  inventoryLevelObj: any = {};
  modalRef: any;

  constructor(
    private inventoryLevelService: InventoryLevelService,
    private partService: PartService,
    private binService: BinService,
    private statusService: StatusService,
    private privilegeService: PrivilegeService,
    private userAuthService: UserAuthService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isEditInventoryLevel = false;
    this.GetAllInventoryLevel();
    this.loadLookups();
    this.getprivilegeforComponent();
  }

  get visibleLevels(): Array<any> {
    const query = (this.searchText || '').toLowerCase();
    if (!query) {
      return this.InventoryLevels;
    }
    return this.InventoryLevels.filter((row: any) =>
      (row.part?.partName || '').toLowerCase().includes(query) ||
      (row.part?.partNumber || '').toLowerCase().includes(query) ||
      (row.binId?.binCode || '').toLowerCase().includes(query) ||
      (row.status?.name || '').toLowerCase().includes(query)
    );
  }

  loadLookups(): void {
    this.partService.GetAllParts().subscribe(allData => {
      this.parts = (allData?.data?.dataList || []).map((part: any) => ({
        ...part,
        label: part.partNumber ? part.partName + ' (' + part.partNumber + ')' : part.partName
      }));
    });
    this.binService.GetAllBins().subscribe(allData => {
      this.bins = (allData?.data?.dataList || []).map((bin: any) => ({
        ...bin,
        label: bin.binCode + (bin.binDescription ? ' - ' + bin.binDescription : '')
      }));
    });
    this.statusService.GetAllStatus().subscribe(allData => {
      this.statuses = allData?.data?.dataList || [];
    });
  }

  getprivilegeforComponent(): void {
    this.roleNameForPrivilege = this.userAuthService.getRoles();
    if (this.roleNameForPrivilege != null) {
      for (let i = 0; i < this.roleNameForPrivilege.length; i++) {
        this.roleName = this.roleNameForPrivilege[i].roleName;
      }
    }
    this.moduleId = "2";
    this.privilegeService.GetAllPrivilegeForComponent(this.roleName, this.moduleId).subscribe(allData => {
      this.deleteValue = allData.data.dataList[0].del;
      this.editValue = allData.data.dataList[0].upd;
      this.insertValue = allData.data.dataList[0].ins;
      this.selectValue = allData.data.dataList[0].sel;
      this.updateBtn = this.editValue == "0";
    });
  }

  openCreate(content: any): void {
    this.isEditInventoryLevel = false;
    this.inventoryLevelObj = { quantityOnHand: 0, minimumStockLevel: 0, maximumStockLevel: 0 };
    this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  openEdit(row: any, content: any): void {
    this.inventoryLevelService.GetInventoryLevelById(row.id).subscribe(allData => {
      const data = allData.data.dataList[0];
      this.isEditInventoryLevel = true;
      this.inventoryLevelObj = {
        id: data.id,
        partId: data.part?.id,
        binId: data.binId?.id,
        quantityOnHand: data.quantityOnHand,
        minimumStockLevel: data.minimumStockLevel,
        maximumStockLevel: data.maximumStockLevel,
        status: data.status?.id,
        createdBy: data.createdBy
      };
      this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
    });
  }

  stockState(row: any): string {
    if (row.quantityOnHand <= row.minimumStockLevel) {
      return 'Low';
    }
    if (row.maximumStockLevel > 0 && row.quantityOnHand >= row.maximumStockLevel) {
      return 'High';
    }
    return 'OK';
  }

  SaveInventoryLevel(): void {
    this.type = this.isEditInventoryLevel == false ? 'Add' : 'Update';
    const payload: any = {
      id: this.inventoryLevelObj.id,
      partId: Number(this.inventoryLevelObj.partId),
      binId: this.inventoryLevelObj.binId,
      quantityOnHand: Number(this.inventoryLevelObj.quantityOnHand),
      minimumStockLevel: Number(this.inventoryLevelObj.minimumStockLevel),
      maximumStockLevel: Number(this.inventoryLevelObj.maximumStockLevel),
      status: Number(this.inventoryLevelObj.status),
      createdBy: this.inventoryLevelObj.createdBy || 0
    };

    swal({
      title: "Are you sure?",
      text: this.type == 'Add' ? "That you want to add this stock record?" : "That you want to update this stock record?",
      icon: "warning",
      dangerMode: true,
    }).then(willSave => {
      if (!willSave) {
        return;
      }
      this.saving = true;
      this.inventoryLevelService.createInventoryLevel(payload, this.type).subscribe({
        next: () => {
          this.saving = false;
          if (this.modalRef) {
            this.modalRef.close();
          }
          this.GetAllInventoryLevel();
          swal("Successful!", this.type == 'Add' ? "Stock record has been added." : "Stock record has been updated.", "success");
        },
        error: (err) => {
          this.saving = false;
          swal("Could not save", err?.error?.message || "The stock record could not be saved.", "error");
        }
      });
    });
  }

  DeleteById(ID: any) {
    swal({
      title: "Are you sure",
      text: "That you want to delete this stock record?",
      icon: "warning",
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        this.inventoryLevelService.DeleteInventoryLevelById(ID).subscribe({
          next: () => {
            swal("Deleted!", "Stock record has been deleted.", "success");
            this.GetAllInventoryLevel();
          }
        });
      }
    });
  }

  GetAllInventoryLevel() {
    this.inventoryLevelService.GetAllInventoryLevels().subscribe(allData => {
      this.InventoryLevels = allData?.data?.dataList || [];
    });
  }
}
