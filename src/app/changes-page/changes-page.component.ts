import { Component, OnInit } from '@angular/core';
import {FirebaseController} from "../../firebase-controller/firebase";

@Component({
  selector: 'app-changes-page',
  templateUrl: './changes-page.component.html',
  styleUrls: ['./changes-page.component.css']
})
export class ChangesPageComponent implements OnInit {

  dbController : FirebaseController

  changes : Map<string, string>[] = []

  constructor() {
    this.dbController = new FirebaseController()
  }

  async ngOnInit() {
    await this.refresh();
  }

  async uploadChanges() {
    this.changes = await this.dbController.getChanges()
  }


  async refresh() {
    await this.uploadChanges()
  }

}

