import { Component, OnInit } from '@angular/core';
import {FirebaseController} from "../../../firebase-controller/firebase";

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})

export class StatisticsPageComponent implements OnInit {

  usersNum = 0

  users : string[] = []

  dbController : FirebaseController

  constructor() {
    this.dbController = new FirebaseController()
  }

  async ngOnInit() {
    await this.refresh()
    await this.uploadUsers();
  }

  async uploadUsers() {
    this.users = await this.dbController.getUsersEmails()
  }


  async refresh() {
    await this.uploadUsers()
    this.usersNum = this.users.length
  }

}
