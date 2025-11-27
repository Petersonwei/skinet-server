import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from './product-item/product-item.component';
import { ShopService } from '../../shared/services/shop.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { MatSelectionListChange } from '@angular/material/list';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';

@Component({
  selector: 'app-shop',
  imports: [ProductItemComponent, MatButton, MatIcon, MatMenu, MatMenuTrigger, MatSelectionList, MatListOption],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  selectedBrands: string[] = [];
  selectedTypes: string[] = [];
  selectedSort: string = 'name';
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' }
  ];

  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);

  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.selectedBrands, this.selectedTypes, this.selectedSort).subscribe({
      next: (response) => {
        this.products = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.selectedSort = selectedOption.value;
      console.log(this.selectedSort);
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.selectedBrands,
        selectedTypes: this.selectedTypes
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          console.log(result);
          this.selectedBrands = result.selectedBrands;
          this.selectedTypes = result.selectedTypes;
          this.getProducts();
        }
      }
    });
  }
}
