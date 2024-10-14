import { Component, OnInit } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";

@Component({
  selector: 'docs-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
  imports: [NgIf,NgFor],
  standalone: true
})
export class AdminComponent implements OnInit {
  fundraisers: any[] = []
  constructor() {}
  tableList: any[] = []
  getList() {
    // @ts-ignore
    const category = document.querySelector('#category').value
    fetch(`https://24274915.it.scu.edu.au/api/search?category=${category}&organizer=''`)
      .then(response => response.json())
      .then((fundraisers:any) => {
        console.log('fundraisers', fundraisers)
        this.tableList = fundraisers
      })
      .catch(error => console.error('Error fetching fundraisers:', error));
  }

  editItem(id:any) {
    window.location.href = `/manage/addFundraisers?id=${id}`;
  }

  deleteItem(id: any) {
    fetch('https://24274915.it.scu.edu.au/api/deleteData?id='+id, { method: 'DELETE' }).then(res => {
      return res.json()
    }).then(response => {
      window.location.reload()
      alert('delete success!')
    })
  }

  getCategory() {
    const list = document.querySelector('#category')
    let inner = `<option value="">All</option>`
    fetch('https://24274915.it.scu.edu.au/api/category').then(res => {
      return res.json()
    }).then(response => {
      response.forEach((item: { CATEGORY_ID: string; NAME: string; }) => {
        inner += `<option value="` + item.CATEGORY_ID + `">` + item.NAME + `</option>`
      })
      // @ts-ignore
      list.innerHTML = inner
    })
  }

  ngOnInit(): void {
    this.getCategory()
    this.getList()
  }
}
