import { Component, OnInit } from '@angular/core';
import { ProductService } from "../services/product";
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [ProductService]
})
export class ProductComponent implements OnInit {
  page: number = 1;
  totalLimit: number = 6;
  lstProduct: any = [];
  total: number = 0;
  search: string = '';
  sortBy: string = 'name';
  constructor(private productService: ProductService,) { }

  ngOnInit(): void {
    this.getProduct(this.page);
  }
  reload() {
    this.page = 1;
    this.getProduct(this.page);
  }
  getProduct(page) {
    if (!page) {
      page = 1;
    }
    let order_key = "name";
    let order_value = "ASC";
    if (this.sortBy == 'name') {
      order_key = "name";
      order_value = "ASC";
    }
    else if (this.sortBy == 'low-high') {
      order_key = "price";
      order_value = "ASC";
    }
    else if (this.sortBy == 'high-low') {
      order_key = "price";
      order_value = "DESC";
    }
    else if (this.sortBy == 'newest') {
      order_key = "created_date";
      order_value = "DESC";
    }
    this.productService.getProduct({
      page: page,
      limit: this.totalLimit,
      search: this.search,
      order_key: order_key,
      order_value: order_value
    }).subscribe(res => {
      if (res) {
        this.lstProduct = res.data;
        for (let index = 0; index <  this.lstProduct.length; index++) {
          const element =  this.lstProduct[index];
          element.price = parseFloat(element.price).toFixed(2);
          
        }
        this.total = res.records_total;
      }
    })
  }
}
