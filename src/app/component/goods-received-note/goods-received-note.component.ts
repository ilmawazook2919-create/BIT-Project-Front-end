import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import swal from 'sweetalert';
import { PrivilegeService } from '../services/api/privilege/privilege.service';
import { UserAuthService } from '../services/api/user/user-auth.service';
import { GoodsReceivedNoteService } from 'src/app/goods-received-note.service';
import { PurchaseOrderService } from 'src/app/purchase-order.service';
import { PurchaseOrderItemService } from 'src/app/purchase-order-item.service';
import { GrnItemService } from 'src/app/grn-item.service';
import { BinService } from 'src/app/bin.service';
import { StatusService } from '../services/api/status/status.service';

@Component({
  selector: 'app-goods-received-note',
  templateUrl: './goods-received-note.component.html',
  styleUrls: ['./goods-received-note.component.scss']
})
export class GoodsReceivedNoteComponent {
  deleteValue: string;
  editValue: string;
  insertValue: string;
  selectValue: string;
  updateBtn: boolean = false;
  saving: boolean = false;

  type: string;
  roleName: any;
  moduleId: string;
  goodsReceivedNotes: Array<any> = [];
  purchaseOrders: Array<any> = [];
  bins: Array<any> = [];
  statuses: Array<any> = [];
  lines: Array<any> = [];
  searchText: string = '';
  isEditGoodsReceivedNote: boolean = false;
  roleNameForPrivilege: Array<any> = [];
  grnObj: any = {};
  modalRef: any;

  constructor(
    private goodsReceivedNoteService: GoodsReceivedNoteService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseOrderItemService: PurchaseOrderItemService,
    private grnItemService: GrnItemService,
    private binService: BinService,
    private statusService: StatusService,
    private privilegeService: PrivilegeService,
    private userAuthService: UserAuthService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isEditGoodsReceivedNote = false;
    this.GetAllGoodsReceivedNote();
    this.loadLookups();
    this.getprivilegeforComponent();
  }

  get visibleNotes(): Array<any> {
    const query = (this.searchText || '').toLowerCase();
    if (!query) {
      return this.goodsReceivedNotes;
    }
    return this.goodsReceivedNotes.filter((row: any) =>
      (row.id || '').toLowerCase().includes(query) ||
      (row.purchaseOrder?.purchaseNumber || '').toLowerCase().includes(query) ||
      (row.status?.name || '').toLowerCase().includes(query)
    );
  }

  loadLookups(): void {
    this.purchaseOrderService.GetAllPurchaseOrders().subscribe(allData => {
      this.purchaseOrders = (allData?.data?.dataList || []).map((order: any) => ({
        ...order,
        label: order.purchaseNumber + (order.supplierId?.supplierName ? ' - ' + order.supplierId.supplierName : '')
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
    this.resetForm();
    this.modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static', scrollable: true });
  }

  openEdit(row: any, content: any): void {
    this.goodsReceivedNoteService.GetGoodsReceivedNoteById(row.id).subscribe(allData => {
      const data = allData.data.dataList[0];
      this.isEditGoodsReceivedNote = true;
      this.grnObj = {
        id: data.id,
        purchaseOrderId: data.purchaseOrder?.id,
        receiptDate: this.toInputDate(data.receiptDate),
        status: data.status?.id,
        createdBy: data.createdBy
      };
      this.loadSavedLines(data.id);
      this.modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static', scrollable: true });
    });
  }

  resetForm(): void {
    this.isEditGoodsReceivedNote = false;
    this.grnObj = {};
    this.lines = [];
    this.saving = false;
  }

  onPurchaseOrderSelected(): void {
    if (this.isEditGoodsReceivedNote) {
      return;
    }
    const purchaseOrderId = this.grnObj.purchaseOrderId;
    forkJoin({
      items: this.purchaseOrderItemService.GetAllpurchaseOrderItems(),
      notes: this.goodsReceivedNoteService.GetAllGoodsReceivedNotes(),
      received: this.grnItemService.GetAllGrnItems()
    }).subscribe(result => {
      const noteIds = (result.notes?.data?.dataList || [])
        .filter((note: any) => note.purchaseOrder?.id == purchaseOrderId)
        .map((note: any) => note.id);
      const receivedByPart = new Map<number, number>();
      (result.received?.data?.dataList || [])
        .filter((item: any) => noteIds.indexOf(item.goodsReceivedNoteId?.id) >= 0)
        .forEach((item: any) => {
          const partId = Number(item.partId?.id);
          receivedByPart.set(partId, (receivedByPart.get(partId) || 0) + Number(item.quantity || 0));
        });
      this.lines = (result.items?.data?.dataList || [])
        .filter((item: any) => item.purchaseOrderId?.id == purchaseOrderId)
        .map((item: any) => {
          const ordered = Number(item.quantityOrdered) || 0;
          const already = receivedByPart.get(Number(item.partId?.id)) || 0;
          return {
            partId: item.partId?.id,
            partName: item.partId?.partName,
            partNumber: item.partId?.partNumber,
            quantityOrdered: ordered,
            alreadyReceived: already,
            quantityReceived: Math.max(ordered - already, 0),
            binId: null
          };
        });
    });
  }

  loadSavedLines(goodsReceivedNoteId: any): void {
    this.grnItemService.GetAllGrnItems().subscribe(allData => {
      this.lines = (allData?.data?.dataList || [])
        .filter((item: any) => item.goodsReceivedNoteId?.id == goodsReceivedNoteId)
        .map((item: any) => ({
          id: item.id,
          partId: item.partId?.id,
          partName: item.partId?.partName,
          partNumber: item.partId?.partNumber,
          quantityOrdered: item.quantity,
          quantityReceived: item.quantity,
          binId: item.binId?.id,
          status: item.status?.id
        }));
    });
  }

  SaveGoodsReceivedNote(): void {
    const receivedLines = this.lines.filter((line: any) => line.id || Number(line.quantityReceived) > 0);
    if (!receivedLines.length) {
      swal("Nothing to receive", "Enter a received quantity for at least one item.", "warning");
      return;
    }
    if (receivedLines.some((line: any) => Number(line.quantityReceived) > 0 && !line.binId)) {
      swal("Select a bin", "Every received item needs a bin so the stock can be updated.", "warning");
      return;
    }

    this.type = this.isEditGoodsReceivedNote == false ? 'Add' : 'Update';
    const payload: any = {
      id: this.grnObj.id,
      purchaseOrderId: Number(this.grnObj.purchaseOrderId),
      receiptDate: this.grnObj.receiptDate,
      status: Number(this.grnObj.status),
      createdBy: this.grnObj.createdBy || 0,
      modifyBy: 0
    };

    swal({
      title: "Are you sure?",
      text: this.type == 'Add' ? "Save this goods received note and update stock?" : "Update this goods received note and stock?",
      icon: "warning",
      dangerMode: true,
    }).then(willSave => {
      if (!willSave) {
        return;
      }
      this.saving = true;
      this.goodsReceivedNoteService.createGoodsReceivedNotee(payload, this.type).subscribe({
        next: (result): void => {
          const goodsReceivedNoteId = this.type == 'Add' ? result.data : payload.id;
          const calls = receivedLines.map((line: any) => this.grnItemService.createGrnItem({
            id: line.id,
            goodsReceivedNoteId: goodsReceivedNoteId,
            partId: Number(line.partId),
            binId: line.binId,
            quantityReceived: String(line.quantityReceived),
            status: Number(line.status || payload.status),
            createdBy: payload.createdBy,
            modifyBy: payload.modifyBy
          }, line.id ? 'Update' : 'Add'));
          forkJoin(calls).subscribe({
            next: () => this.finishSave(this.type == 'Add'
              ? "Goods received note has been added and stock was updated."
              : "Goods received note and stock have been updated."),
            error: (err) => this.failSave(err)
          });
        },
        error: (err) => this.failSave(err)
      });
    });
  }

  GetAllGoodsReceivedNote() {
    this.goodsReceivedNoteService.GetAllGoodsReceivedNotes().subscribe(allData => {
      this.goodsReceivedNotes = allData?.data?.dataList || [];
    });
  }

  DeleteById(ID: any) {
    swal({
      title: "Are you sure",
      text: "That you want to delete this goods received note? Received quantities will be removed from stock.",
      icon: "warning",
      dangerMode: true,
    }).then(willDelete => {
      if (!willDelete) {
        return;
      }
      this.grnItemService.GetAllGrnItems().subscribe({
        next: (allData) => {
          const lines = (allData?.data?.dataList || []).filter((item: any) => item.goodsReceivedNoteId?.id == ID);
          const removeLines = lines.length
            ? forkJoin(lines.map((item: any) => this.grnItemService.DeleteGrnItemById(item.id)))
            : of(null);
          removeLines.subscribe({
            next: () => {
              this.goodsReceivedNoteService.DeleteGoodsReceivedNoteById(ID).subscribe({
                next: () => {
                  swal("Deleted!", "Goods received note has been deleted and stock was reduced.", "success");
                  this.GetAllGoodsReceivedNote();
                },
                error: (err) => this.failSave(err)
              });
            },
            error: (err) => this.failSave(err)
          });
        },
        error: (err) => this.failSave(err)
      });
    });
  }

  private finishSave(message: string): void {
    this.saving = false;
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.resetForm();
    this.GetAllGoodsReceivedNote();
    swal("Successful!", message, "success");
  }

  private failSave(err: any): void {
    this.saving = false;
    const message = err?.error?.message || "The goods received note could not be saved.";
    swal("Could not save", message, "error");
  }

  private toInputDate(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string' && value.length >= 10) {
      return value.substring(0, 10);
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }
}
