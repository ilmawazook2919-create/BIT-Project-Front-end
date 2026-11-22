import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { GrnItemService } from '../grn-item.service';
import { GoodsReceivedNoteService } from '../goods-received-note.service';
import { PartService } from '../part.service';
import { BinService } from '../bin.service';
import { StatusService } from '../component/services/api/status/status.service';
import { ListPage } from '../list-page';

@Component({
  selector: 'app-grn-item',
  templateUrl: './grn-item.component.html',
  styleUrls: ['./grn-item.component.scss']
})
export class GrnItemComponent {
  deleteValue: string;
  editValue: string;
  insertValue: string;
  selectValue: string;
  updateBtn: boolean = false;
  saving: boolean = false;

  type: string;
  roleName: any;
  moduleId: string;
  grnItems: Array<any> = [];
  notes: Array<any> = [];
  parts: Array<any> = [];
  bins: Array<any> = [];
  statuses: Array<any> = [];
  searchText: string = '';
  pager = new ListPage();
  isEditGrnItem: boolean = false;
  roleNameForPrivilege: Array<any> = [];
  grnItemObj: any = {};
  modalRef: any;

  constructor(
    private grnItemService: GrnItemService,
    private goodsReceivedNoteService: GoodsReceivedNoteService,
    private partService: PartService,
    private binService: BinService,
    private statusService: StatusService,
    private privilegeService: PrivilegeService,
    private userAuthService: UserAuthService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isEditGrnItem = false;
    this.GetAllGrnItem();
    this.loadLookups();
    this.getprivilegeforComponent();
  }

  get visibleItems(): Array<any> {
    const query = (this.searchText || '').toLowerCase();
    if (!query) {
      return this.grnItems;
    }
    return this.grnItems.filter((row: any) =>
      (row.goodsReceivedNoteId?.id || '').toLowerCase().includes(query) ||
      (row.partId?.partName || '').toLowerCase().includes(query) ||
      (row.binId?.binCode || '').toLowerCase().includes(query)
    );
  }

  loadLookups(): void {
    this.goodsReceivedNoteService.GetAllGoodsReceivedNotes().subscribe(allData => {
      this.notes = (allData?.data?.dataList || []).map((note: any) => ({
        ...note,
        label: note.id + (note.purchaseOrder?.purchaseNumber ? ' / ' + note.purchaseOrder.purchaseNumber : '')
      }));
    });
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
    this.isEditGrnItem = false;
    this.grnItemObj = { quantityReceived: 1 };
    this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  openEdit(row: any, content: any): void {
    this.grnItemService.GetGrnItemById(row.id).subscribe(allData => {
      const data = allData.data.dataList[0];
      this.isEditGrnItem = true;
      this.grnItemObj = {
        id: data.id,
        goodsReceivedNoteId: data.goodsReceivedNoteId?.id,
        partId: data.partId?.id,
        binId: data.binId?.id,
        quantityReceived: data.quantity,
        status: data.status?.id,
        createdBy: data.createdBy
      };
      this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
    });
  }

  SaveGrnItem(): void {
    this.type = this.isEditGrnItem == false ? 'Add' : 'Update';
    const payload = {
      id: this.grnItemObj.id,
      goodsReceivedNoteId: this.grnItemObj.goodsReceivedNoteId,
      partId: Number(this.grnItemObj.partId),
      binId: this.grnItemObj.binId,
      quantityReceived: String(this.grnItemObj.quantityReceived),
      status: Number(this.grnItemObj.status),
      createdBy: this.grnItemObj.createdBy || 0,
      modifyBy: 0
    };
    swal({
      title: "Are you sure?",
      text: "Saving this line updates the stock for the selected part and bin.",
      icon: "warning",
      dangerMode: true,
    }).then(willSave => {
      if (!willSave) {
        return;
      }
      this.saving = true;
      this.grnItemService.createGrnItem(payload, this.type).subscribe({
        next: () => {
          this.saving = false;
          if (this.modalRef) {
            this.modalRef.close();
          }
          this.GetAllGrnItem();
          swal("Successful!", "Received item has been saved and stock was updated.", "success");
        },
        error: (err) => {
          this.saving = false;
          swal("Could not save", err?.error?.message || "The received item could not be saved.", "error");
        }
      });
    });
  }

  DeleteById(ID: any) {
    swal({
      title: "Are you sure",
      text: "Deleting this line removes its quantity from stock.",
      icon: "warning",
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        this.grnItemService.DeleteGrnItemById(ID).subscribe(() => {
          swal("Deleted!", "Received item has been deleted and stock was reduced.", "success");
          this.GetAllGrnItem();
        });
      }
    });
  }

  GetAllGrnItem() {
    this.grnItemService.GetAllGrnItems().subscribe(allData => {
      this.grnItems = allData?.data?.dataList || [];
    });
  }
}
