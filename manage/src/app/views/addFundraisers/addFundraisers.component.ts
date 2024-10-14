import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'docs-one',
  templateUrl: './addFundraisers.component.html',
  styleUrls: ['./addFundraisers.component.less'],
})
export class AddFundraisersComponent implements OnInit {
  constructor() {}
  fid = null
  caption = null
  organizer = null
  category = null
  city = null
  target = null
  status = null
  content = null
  pic = null

  init():void{
    // @ts-ignore
    this.caption = document.querySelector('#caption');
    // @ts-ignore
    this.organizer = document.querySelector('#organizer')
    // @ts-ignore
    this.category = document.querySelector('#category');
    // @ts-ignore
    this.city = document.querySelector('#city');
    // @ts-ignore
    this.target = document.querySelector('#target');
    // @ts-ignore
    this.status = document.querySelector('#status');
    // @ts-ignore
    this.content = document.querySelector('#content');
    // @ts-ignore
    this.pic = document.querySelector('#pic');
    this.getCategory()
    this.getId()
    this.upload()
  }

  getId() {
    const urlParams = new URLSearchParams(window.location.search);
    // @ts-ignore
    this.fid = urlParams.get('id');
    if(this.fid) {
      this.getDetail(this.fid)
    }
  }
  getDetail(id: any) {
    fetch('https://24274915.it.scu.edu.au/api/fundraiser/' + id).then(res => {
      return res.json()
    }).then(response => {
      const data = response[0]
      let caption = document.querySelector('#caption');
      let organizer = document.querySelector('#organizer')
      let category = document.querySelector('#category');
      let city = document.querySelector('#city');
      let target = document.querySelector('#target');
      let status = document.querySelector('#status');
      let content = document.querySelector('#content');
      // @ts-ignore
      caption.value = data.CAPTION
      // @ts-ignore
      organizer.value = data.ORGANIZER
      // @ts-ignore
      category.value = data.CATEGORY_ID
      // @ts-ignore
      city.value = data.CITY
      // @ts-ignore
      target.value = data.TARGET_FUNDING
      // @ts-ignore
      status.value = data.ACTIVE
      // @ts-ignore
      content.value = data.DESCRIBE
    })
  }

  upload() {
    // @ts-ignore
    this.pic.addEventListener('change', async () => {
      // @ts-ignore
      const file = this.pic.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        fetch('https://24274915.it.scu.edu.au/api/upload', {
          method: 'POST',
          body: formData
        }).then(res => res.json()).then(response => {
          this.submit(response.data);
          alert('Submit Infomation Success!')
        })
      } catch (error) {
        console.error('error', error);
      }
    });
  }
  // @ts-ignore
  submit(imgPath) {
    // @ts-ignore
    let caption = document.querySelector('#caption').value;
    // @ts-ignore
    let organizer = document.querySelector('#organizer').value
    // @ts-ignore
    let category = document.querySelector('#category').value;
    // @ts-ignore
    let city = document.querySelector('#city').value;
    // @ts-ignore
    let target = document.querySelector('#target').value;
    // @ts-ignore
    let status = document.querySelector('#status').value;
    // @ts-ignore
    let content = document.querySelector('#content').value;
    let data = {
      id: null,
      caption: caption,
      organizer: organizer,
      category: category,
      city: city,
      status: status,
      target: target,
      describe: content,
      url: imgPath
    }
    if (this.fid) {
      data.id = this.fid
      fetch('https://24274915.it.scu.edu.au/api/updateData', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('success');
        })
    } else {
      fetch('https://24274915.it.scu.edu.au/api/insertData', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('success');
        })
    }
  }

  getCategory() {
    let list = document.querySelector('#category')
    let inner = ''
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
    this.init()
  }
}
