import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import swal from 'sweetalert';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { PurchaseOrderService } from '../purchase-order.service';
import { PurchaseOrderItemService } from '../purchase-order-item.service';
import { SupplierService } from '../supplier.service';
import { PartService } from '../part.service';
import { StatusService } from '../component/services/api/status/status.service';
import { ListPage } from '../list-page';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent {
  deleteValue: string;
  editValue: string;
  insertValue: string;
  selectValue: string;
  updateBtn: boolean = false;
  saving: boolean = false;

  type: string;
  roleName: any;
  moduleId: string;
  purchaseOrders: Array<any> = [];
  suppliers: Array<any> = [];
  parts: Array<any> = [];
  statuses: Array<any> = [];
  lines: Array<any> = [];
  searchText: string = '';
  pager = new ListPage();
  isEditPurchaseOrder: boolean = false;
  roleNameForPrivilege: Array<any> = [];
  purchaseOrderObj: any = {};
  modalRef: any;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private purchaseOrderItemService: PurchaseOrderItemService,
    private supplierService: SupplierService,
    private partService: PartService,
    private statusService: StatusService,
    private privilegeService: PrivilegeService,
    private userAuthService: UserAuthService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEditPurchaseOrder = false;
    this.GetAllPurchaseOrder();
    this.loadLookups();
    this.getprivilegeforComponent();
  }

  get visibleOrders(): Array<any> {
    const query = (this.searchText || '').toLowerCase();
    if (!query) {
      return this.purchaseOrders;
    }
    return this.purchaseOrders.filter((row: any) =>
      (row.purchaseNumber || '').toLowerCase().includes(query) ||
      (row.supplierId?.supplierName || '').toLowerCase().includes(query) ||
      (row.status?.name || '').toLowerCase().includes(query)
    );
  }

  loadLookups(): void {
    this.supplierService.GetAllSuppliers().subscribe(allData => {
      this.suppliers = allData?.data?.dataList || [];
    });
    this.partService.GetAllParts().subscribe(allData => {
      this.parts = (allData?.data?.dataList || []).map((part: any) => ({
        ...part,
        label: part.partNumber ? part.partName + ' (' + part.partNumber + ')' : part.partName
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
    this.moduleId = "6";
    this.privilegeService.GetAllPrivilegeForComponent(this.roleName, this.moduleId)
      .subscribe(allData => {
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
    this.purchaseOrderService.GetPurchaseOrderById(row.id).subscribe(allData => {
      const data = allData.data.dataList[0];
      this.isEditPurchaseOrder = true;
      this.purchaseOrderObj = {
        id: data.id,
        purchaseNumber: data.purchaseNumber,
        supplierId: data.supplierId?.id,
        orderDate: this.toInputDate(data.orderDate),
        expectedDeliveryDate: this.toInputDate(data.expectedDeliveryDate),
        totalAmount: data.totalAmount,
        status: data.status?.id,
        createdBy: data.createdBy
      };
      this.loadLines(data.id);
      this.modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static', scrollable: true });
    });
  }

  resetForm(): void {
    this.isEditPurchaseOrder = false;
    this.purchaseOrderObj = {};
    this.lines = [{ partId: null, quantityOrdered: 1, unitCost: 0 }];
    this.saving = false;
  }

  addLine(): void {
    this.lines.push({ partId: null, quantityOrdered: 1, unitCost: 0, status: this.purchaseOrderObj.status });
  }

  removeLine(index: number): void {
    const line = this.lines[index];
    if (line.id) {
      this.purchaseOrderItemService.DeletePurchaseOrderItemById(line.id).subscribe({
        next: () => {
          this.lines.splice(index, 1);
          this.recalcTotal();
        },
        error: (err) => this.failSave(err)
      });
      return;
    }
    this.lines.splice(index, 1);
    this.recalcTotal();
  }

  onPartChange(line: any): void {
    const part = this.parts.find((item: any) => item.id == line.partId);
    if (part) {
      line.unitCost = part.unitCost || 0;
    }
    this.recalcTotal();
  }

  recalcTotal(): void {
    const total = this.lines.reduce((sum: number, line: any) => {
      return sum + (Number(line.quantityOrdered) || 0) * (Number(line.unitCost) || 0);
    }, 0);
    this.purchaseOrderObj.totalAmount = total as any;
  }

  lineAmount(line: any): number {
    return (Number(line.quantityOrdered) || 0) * (Number(line.unitCost) || 0);
  }

  SavePurchaseOrder(): void {
    this.recalcTotal();
    if (!this.lines.length) {
      swal("Add items", "A purchase order needs at least one item.", "warning");
      return;
    }
    const partIds = this.lines.map((line: any) => Number(line.partId));
    if (partIds.some((id: number) => !id) || new Set(partIds).size !== partIds.length) {
      swal("Check the items", "Select each part once and put the full quantity on that line.", "warning");
      return;
    }

    this.type = this.isEditPurchaseOrder == false ? 'Add' : 'Update';
    const payload: any = {
      id: this.purchaseOrderObj.id,
      purchaseNumber: this.purchaseOrderObj.purchaseNumber,
      supplierId: this.purchaseOrderObj.supplierId,
      orderDate: this.purchaseOrderObj.orderDate,
      expectedDeliveryDate: this.purchaseOrderObj.expectedDeliveryDate,
      totalAmount: Number(this.purchaseOrderObj.totalAmount) || 0,
      status: Number(this.purchaseOrderObj.status),
      createdBy: this.purchaseOrderObj.createdBy || 0
    };

    swal({
      title: "Are you sure?",
      text: this.type == 'Add' ? "That you want to add this purchase order?" : "That you want to update this purchase order?",
      icon: "warning",
      dangerMode: true,
    }).then(willSave => {
      if (!willSave) {
        return;
      }
      this.saving = true;
      this.purchaseOrderService.createPurchaseOrder(payload, this.type).subscribe({
        next: (result): void => {
          const purchaseOrderId = this.type == 'Add' ? result.data : payload.id;
          const calls = this.lines.map((line: any) => this.purchaseOrderItemService.createPurchaseOrderItem({
            id: line.id,
            purchaseOrderId: Number(purchaseOrderId),
            partId: Number(line.partId),
            quantityOrdered: Number(line.quantityOrdered),
            unitCost: Number(line.unitCost),
            status: Number(line.status || payload.status),
            createdBy: payload.createdBy
          }, line.id ? 'Update' : 'Add'));
          forkJoin(calls).subscribe({
            next: () => this.finishSave(this.type == 'Add' ? "Purchase order has been added." : "Purchase order has been updated."),
            error: (err) => this.failSave(err)
          });
        },
        error: (err) => this.failSave(err)
      });
    });
  }

  GetAllPurchaseOrder() {
    this.purchaseOrderService.GetAllPurchaseOrders().subscribe(allData => {
      this.purchaseOrders = allData?.data?.dataList || [];
    });
  }

  loadLines(purchaseOrderId: any): void {
    this.purchaseOrderItemService.GetAllpurchaseOrderItems().subscribe(allData => {
      this.lines = (allData?.data?.dataList || [])
        .filter((item: any) => item.purchaseOrderId?.id == purchaseOrderId)
        .map((item: any) => ({
          id: item.id,
          partId: item.partId?.id,
          quantityOrdered: item.quantityOrdered,
          unitCost: item.unitCost,
          status: item.status?.id
        }));
      if (!this.lines.length) {
        this.addLine();
      }
      this.recalcTotal();
    });
  }

  DeletePurchaseOrderById(ID: any) {
    swal({
      title: "Are you sure",
      text: "That you want to delete this purchase order?",
      icon: "warning",
      dangerMode: true,
    }).then(willDelete => {
      if (!willDelete) {
        return;
      }
      this.purchaseOrderItemService.GetAllpurchaseOrderItems().subscribe({
        next: (allData) => {
          const lines = (allData?.data?.dataList || []).filter((item: any) => item.purchaseOrderId?.id == ID);
          const removeLines = lines.length
            ? forkJoin(lines.map((item: any) => this.purchaseOrderItemService.DeletePurchaseOrderItemById(item.id)))
            : of(null);
          removeLines.subscribe({
            next: () => {
              this.purchaseOrderService.DeletepurchaseOrderById(ID).subscribe({
                next: () => {
                  swal("Deleted!", "Purchase order has been deleted.", "success");
                  this.GetAllPurchaseOrder();
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
    this.GetAllPurchaseOrder();
    swal("Successful!", message, "success");
  }

  private failSave(err: any): void {
    this.saving = false;
    const message = err?.error?.message || "The purchase order could not be saved.";
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
