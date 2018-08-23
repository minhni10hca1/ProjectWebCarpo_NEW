import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../../core/services/data.service';

import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageContstants } from '../../../core/common/message.constants';
import 'rxjs/Rx';
import * as _ from 'lodash';

import { IItemsMovedEvent, IListBoxItem } from '../../../core/models/index';

export interface CarActiveTrue {
  _id: string;
  active: {
    type: string,
    default: true
  }
}
export interface CarActiveFalse {
  _id: string;
  active: {
    type: string,
    default: false
  }
}
@Component({
  selector: 'app-dual-list-box',
  templateUrl: 'dual-list-box.component.html',
  styleUrls: ['dual-list-box.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DualListBoxComponent),
    multi: true
  }]
})
export class DualListBoxComponent implements OnInit, ControlValueAccessor {
  private campaignId: string;
  public campaignCarEntity: any = {};
  // input to set search term for available list box from the outside
  @Input() set availableSearch(searchTerm: string) {
    this.searchTermAvailable = searchTerm;
    this.availableSearchInputControl.setValue(searchTerm);
  };
  // input to set search term for selected list box from the outside
  @Input() set selectedSearch(searchTerm: string) {
    this.searchTermSelected = searchTerm;
    this.selectedSearchInputControl.setValue(searchTerm);
  };
  // field to use for value of option
  @Input() valueField = '_id';
  // field to use for displaying option text
  @Input() textField = 'device_id';
  // text to display as title above component
  @Input() title: string;
  // time to debounce search output in ms
  @Input() debounceTime = 500;
  // show/hide button to move all items between boxes
  @Input() moveAllButton = true;
  // text displayed over the available items list box
  @Input() availableText = 'Danh sách xe chưa gán';
  // text displayed over the selected items list box
  @Input() selectedText = 'Danh sách xe đã gán';
  // set placeholder text in available items list box
  @Input() availableFilterPlaceholder = 'Tìm kiếm...';
  // set placeholder text in selected items list box
  @Input() selectedFilterPlaceholder = 'Tìm kiếm...';

  // event called when item or items from available items(left box) is selected
  @Output() onAvailableItemSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // event called when item or items from selected items(right box) is selected
  @Output() onSelectedItemsSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // event called when items are moved between boxes, returns state of both boxes and item moved
  @Output() onItemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<IItemsMovedEvent>();

  // private variables to manage class
  searchTermAvailable: string = '';
  searchTermSelected: string = '';
  availableItems: Array<IListBoxItem> = [];
  selectedItems: Array<IListBoxItem> = [];
  listBoxForm: FormGroup;
  availableListBoxControl: FormControl = new FormControl();
  selectedListBoxControl: FormControl = new FormControl();
  availableSearchInputControl: FormControl = new FormControl();
  selectedSearchInputControl: FormControl = new FormControl();

  // control value accessors
  _onChange = (_: any) => { };
  _onTouched = () => { };

  constructor(public fb: FormBuilder,
    private _utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private _dataService: DataService,
    private _notificationService: NotificationService
  ) {

    this.listBoxForm = this.fb.group({
      availableListBox: this.availableListBoxControl,
      selectedListBox: this.selectedListBoxControl,
      availableSearchInput: this.availableSearchInputControl,
      selectedSearchInput: this.selectedSearchInputControl
    });
  }

  //test
  //load danh sách xe chưa có hợp đồng
  private loadAvailableCars() {
    this._dataService.get('/cars/available')
      .subscribe((response: any) => {
        if (response.success == 1 && response.data.length > 0) {
          console.log('response.data' , response.data);
          this.availableItems = [...(response.data || []).map((item: {}, index: number) => ({
            value: item[this.valueField],
            text: item[this.textField]
          }))];
        }
      }, error => this._dataService.handleError(error));
  }

  //ds xe đã gán
  public loadSelectedItems() {
    this._dataService.get('/campaigns/selectedItems/' + this.campaignId)
      .subscribe((response: any) => {
        this.title = response.title;
        this.selectedItems = [];
        if (response.success == 1 && response.data.length > 0) {
          this.selectedItems = [...(response.data || []).map((item: {}, index: number) => ({
            value: item[this.valueField],
            text: item[this.textField]
          }))];
        }
      }, error => this._dataService.handleError(error));
  }
  //lưu
  //Save change for modal popup cars
  saveConfirm() {
    this.campaignCarEntity.carsTrue = {}; // ds xe dc gán
    this.campaignCarEntity.carsFalse = {}; // ds xe chưa gán
    this.campaignCarEntity.carsTrue = this.selectedItems;
    this.campaignCarEntity.carsFalse = this.availableItems;
    this._dataService.put('/campaigns/updateCars/' + this.campaignId, JSON.stringify(this.campaignCarEntity)).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
      this.reset();
      this.goBack();
    }, error => this._dataService.handleError(error));
  }
  //Click button delete turn on confirm
  public save() {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_SAVE_MSG, () => this.saveConfirm());
  }
  goBack() {
    this._utilityService.navigate('/main/contract/index');
  }
  reset() {
    this.listBoxForm.reset();
  }
  //test
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.campaignId = params['id'];
      // this.campaignCarEntity = {
      //   _id: params['id']
      // };
    });
    this.loadAvailableCars(); //ds xe chưa gán
    this.loadSelectedItems(); //ds xe da gan
    this.availableListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onAvailableItemSelected.emit(items));
    this.selectedListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onSelectedItemsSelected.emit(items));
    this.availableSearchInputControl
      .valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe((search: string) => this.searchTermAvailable = search);
    this.selectedSearchInputControl
      .valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe((search: string) => this.searchTermSelected = search);
  }

  /**
   * Move all items from available to selected
   */
  moveAllItemsToSelected(): void {

    if (!this.availableItems.length) {
      return;
    }
    this.selectedItems = [...this.selectedItems, ...this.availableItems];
    this.availableItems = [];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.availableListBoxControl.value
    });
    this.availableListBoxControl.setValue([]);
    this.writeValue(this.getValues());
  }

  /**
   * Move all items from selected to available
   */
  moveAllItemsToAvailable(): void {

    if (!this.selectedItems.length) {
      return;
    }
    this.availableItems = [...this.availableItems, ...this.selectedItems];
    this.selectedItems = [];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.selectedListBoxControl.value
    });
    this.selectedListBoxControl.setValue([]);
    this.writeValue([]);
  }

  /**
   * Move marked items from available items to selected items
   */
  moveMarkedAvailableItemsToSelected(): void {

    // first move items to selected
    this.selectedItems = [...this.selectedItems,
    ..._.intersectionWith(this.availableItems, this.availableListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // now filter available items to not include marked values
    this.availableItems = [..._.differenceWith(this.availableItems, this.availableListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // clear marked available items and emit event
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.availableListBoxControl.value
    });
    this.availableListBoxControl.setValue([]);
    this.availableSearchInputControl.setValue('');
    this.writeValue(this.getValues());
  }

  /**
   * Move marked items from selected items to available items
   */
  moveMarkedSelectedItemsToAvailable(): void {

    // first move items to available
    this.availableItems = [...this.availableItems,
    ..._.intersectionWith(this.selectedItems, this.selectedListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // now filter available items to not include marked values
    this.selectedItems = [..._.differenceWith(this.selectedItems, this.selectedListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // clear marked available items and emit event
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.selectedListBoxControl.value
    });
    this.selectedListBoxControl.setValue([]);
    this.selectedSearchInputControl.setValue('');
    this.writeValue(this.getValues());
  }

  /**
   * Move single item from available to selected
   * @param item
   */
  moveAvailableItemToSelected(item: IListBoxItem): void {

    this.availableItems = this.availableItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
    this.selectedItems = [...this.selectedItems, item];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: [item.value]
    });
    this.availableSearchInputControl.setValue('');
    this.availableListBoxControl.setValue([]);
    this.writeValue(this.getValues());
  }

  /**
   * Move single item from selected to available
   * @param item
   */
  moveSelectedItemToAvailable(item: IListBoxItem): void {

    this.selectedItems = this.selectedItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
    this.availableItems = [...this.availableItems, item];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: [item.value]
    });
    this.selectedSearchInputControl.setValue('');
    this.selectedListBoxControl.setValue([]);
    this.writeValue(this.getValues());
  }

  /**
   * Function to pass to ngFor to improve performance, tracks items
   * by the value field
   * @param index
   * @param item
   * @returns {any}
   */
  trackByValue(index: number, item: {}): string {
    return item[this.valueField];
  }

  /* Methods from ControlValueAccessor interface, required for ngModel and formControlName - begin */
  writeValue(value: any): void {
    if (this.selectedItems && value && value.length > 0) {
      this.selectedItems = [...this.selectedItems,
      ..._.intersectionWith(this.availableItems, value, (item: IListBoxItem, value: string) => item.value === value)];
      this.availableItems = [..._.differenceWith(this.availableItems, value, (item: IListBoxItem, value: string) => item.value === value)];
    }
    this._onChange(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }
  /* Methods from ControlValueAccessor interface, required for ngModel and formControlName - end */

  /**
   * Utility method to get values from
   * selected items
   * @returns {string[]}
   */
  private getValues(): string[] {
    return (this.selectedItems || []).map((item: IListBoxItem) => item.value);
  }
}
