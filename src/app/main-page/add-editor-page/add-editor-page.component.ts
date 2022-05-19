import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirebaseController} from "../../../firebase-controller/firebase";

@Component({
  selector: 'app-add-editor-page',
  templateUrl: './add-editor-page.component.html',
  styleUrls: ['./add-editor-page.component.css']
})
export class AddEditorPageComponent implements OnInit {

  adminForm : FormGroup
  dbController : FirebaseController

  constructor() { }

  ngOnInit(): void {
    this.adminForm = new FormGroup({
      login : new FormControl(null, [Validators.required, Validators.minLength(7)]),
      password : new FormControl(null, [Validators.required, Validators.minLength(8)]),
    })
    this.dbController = new FirebaseController()
  }

  async addAdmin() {
    await this.dbController.addAdmin(
      this.adminForm.controls["login"].value,
      this.adminForm.controls["password"].value
    ).catch()
    this.clearForm()
  }

  clearForm() {
    this.adminForm.controls["login"].setValue("")
    this.adminForm.controls["password"].setValue("")
  }

}
