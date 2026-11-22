import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert';
import { PrivilegeService } from '../component/services/api/privilege/privilege.service';
import { UserAuthService } from '../component/services/api/user/user-auth.service';
import { PurchaseOrderItemService } from '../purchase-order-item.service';
import { PurchaseOrderService } from '../purchase-order.service';
import { PartService } from '../part.service';
import { StatusService } from '../component/services/api/status/status.service';
import { ListPage } from '../list-page';

@Component({
  selector: 'app-purchase-order-item',
  templateUrl: './purchase-order-item.component.html',
  styleUrls: ['./purchase-order-item.component.scss']
})
export class PurchaseOrderItemComponent {
  deleteValue: string;
  editValue: string;
  insertValue: string;
  selectValue: string;
  updateBtn: boolean = false;
  saving: boolean = false;

  type: string;
  roleName: any;
  moduleId: string;
  PurchaseOrderItems: Array<any> = [];
  purchaseOrders: Array<any> = [];
  parts: Array<any> = [];
  statuses: Array<any> = [];
  searchText: string = '';
  pager = new ListPage();
  isEditPurchaseOrderItem: boolean = false;
  roleNameForPrivilege: Array<any> = [];
  purchaseOrderItemObj: any = {};
  modalRef: any;

  constructor(
    private purchaseOrderItemService: PurchaseOrderItemService,
    private purchaseOrderService: PurchaseOrderService,
    private partService: PartService,
    private statusService: StatusService,
    private privilegeService: PrivilegeService,
    private userAuthService: UserAuthService,
    private modalService: NgbModal,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isEditPurchaseOrderItem = false;
    this.GetAllPurchaseOrderItem();
    this.loadLookups();
    this.getprivilegeforComponent();
  }

  get visibleItems(): Array<any> {
    const query = (this.searchText || '').toLowerCase();
    if (!query) {
      return this.PurchaseOrderItems;
    }
    return this.PurchaseOrderItems.filter((row: any) =>
      (row.purchaseOrderId?.purchaseNumber || '').toLowerCase().includes(query) ||
      (row.partId?.partName || '').toLowerCase().includes(query)
    );
  }

  loadLookups(): void {
    this.purchaseOrderService.GetAllPurchaseOrders().subscribe(allData => {
      this.purchaseOrders = allData?.data?.dataList || [];
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
    this.moduleId = "7";
    this.privilegeService.GetAllPrivilegeForComponent(this.roleName, this.moduleId).subscribe(allData => {
      this.deleteValue = allData.data.dataList[0].del;
      this.editValue = allData.data.dataList[0].upd;
      this.insertValue = allData.data.dataList[0].ins;
      this.selectValue = allData.data.dataList[0].sel;
      this.updateBtn = this.editValue == "0";
    });
  }

  openCreate(content: any): void {
    this.isEditPurchaseOrderItem = false;
    this.purchaseOrderItemObj = { quantityOrdered: 1, unitCost: 0 };
    this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  openEdit(row: any, content: any): void {
    this.purchaseOrderItemService.GetPurchaseOrderItemById(row.id).subscribe(allData => {
      const data = allData.data.dataList[0];
      this.isEditPurchaseOrderItem = true;
      this.purchaseOrderItemObj = {
        id: data.id,
        purchaseOrderId: data.purchaseOrderId?.id,
        partId: data.partId?.id,
        quantityOrdered: data.quantityOrdered,
        unitCost: data.unitCost,
        status: data.status?.id,
        createdBy: data.createdBy
      };
      this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
    });
  }

  onPartChange(): void {
    const part = this.parts.find((item: any) => item.id == this.purchaseOrderItemObj.partId);
    if (part && !this.isEditPurchaseOrderItem) {
      this.purchaseOrderItemObj.unitCost = part.unitCost || 0;
    }
  }

  SavePurchaseOrderItem(): void {
    this.type = this.isEditPurchaseOrderItem == false ? 'Add' : 'Update';
    const payload = {
      id: this.purchaseOrderItemObj.id,
      purchaseOrderId: Number(this.purchaseOrderItemObj.purchaseOrderId),
      partId: Number(this.purchaseOrderItemObj.partId),
      quantityOrdered: Number(this.purchaseOrderItemObj.quantityOrdered),
      unitCost: Number(this.purchaseOrderItemObj.unitCost),
      status: Number(this.purchaseOrderItemObj.status),
      createdBy: this.purchaseOrderItemObj.createdBy || 0
    };
    swal({
      title: "Are you sure?",
      text: this.type == 'Add' ? "That you want to add this item?" : "That you want to update this item?",
      icon: "warning",
      dangerMode: true,
    }).then(willSave => {
      if (!willSave) {
        return;
      }
      this.saving = true;
      this.purchaseOrderItemService.createPurchaseOrderItem(payload, this.type).subscribe({
        next: () => {
          this.saving = false;
          if (this.modalRef) {
            this.modalRef.close();
          }
          this.GetAllPurchaseOrderItem();
          swal("Successful!", this.type == 'Add' ? "Purchase order item has been added." : "Purchase order item has been updated.", "success");
        },
        error: (err) => {
          this.saving = false;
          swal("Could not save", err?.error?.message || "The item could not be saved.", "error");
        }
      });
    });
  }

  DeleteById(ID: any) {
    swal({
      title: "Are you sure",
      text: "That you want to delete this purchase order item?",
      icon: "warning",
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        this.purchaseOrderItemService.DeletePurchaseOrderItemById(ID).subscribe(() => {
          swal("Deleted!", "Purchase order item has been deleted.", "success");
          this.GetAllPurchaseOrderItem();
        });
      }
    });
  }

  GetAllPurchaseOrderItem() {
    this.purchaseOrderItemService.GetAllpurchaseOrderItems().subscribe(allData => {
      this.PurchaseOrderItems = allData?.data?.dataList || [];
    });
  }
}
