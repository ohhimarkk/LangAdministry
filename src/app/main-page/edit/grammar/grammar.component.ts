import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import {TestTheme} from "../../../../models/TestTheme"
import {Task} from "../../../../models/Task"
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirebaseController} from "../../../../firebase-controller/firebase"

@Component({
  selector: 'app-grammar',
  templateUrl: './grammar.component.html',
  styleUrls: ['./grammar.component.css']
})

export class GrammarComponent implements OnInit {

  themes = new Map<string, TestTheme>()

  tasks = new Map<string, Task>()

  hideForm = true

  currentThemeId : string = ""
  currentTaskId : string = ""

  form : FormGroup
  themeForm : FormGroup

  numberValid = "[1-4]"

  dbController : FirebaseController

  loading = false

  newTask = true
  changeExisting = false

  themeType = "grammar themes"


  ngOnInit(): void {
    this.loading = true
    setTimeout(() => {
      this.uploadThemes().catch()
    })
    this.loading = false
    this.form = new FormGroup({
      taskId : new FormControl(null),
      question : new FormControl(null, [Validators.required]),
      variant1 : new FormControl(null, [Validators.required]),
      variant2 : new FormControl(null, [Validators.required]),
      variant3 : new FormControl(null, [Validators.required]),
      variant4 : new FormControl(null, [Validators.required]),
      answerNum: new FormControl(null, [Validators.required, Validators.pattern(this.numberValid)])
    })
    this.themeForm = new FormGroup({
      themeName : new FormControl(null)
    })
    this.dbController = new FirebaseController()

  }

  async uploadTasks(themeId : string) {
    this.currentThemeId = themeId
    this.tasks = await this.dbController.getTasks(themeId, this.themeType).catch()
  }

  async uploadThemes() {
    this.themes = await this.dbController.getThemes(this.themeType)
  }

  questionClick(taskId : string, themeId : string) {
    let task = this.tasks.get(taskId)
    this.form.controls["question"].setValue(task?.question)
    this.form.controls["answerNum"].setValue(task?.answerNum)
    this.form.controls["variant1"].setValue(task?.choices[0])
    this.form.controls["variant2"].setValue(task?.choices[1])
    this.form.controls["variant3"].setValue(task?.choices[2])
    this.form.controls["variant4"].setValue(task?.choices[3])

    this.newTask = false
    this.currentThemeId = themeId
    this.currentTaskId = taskId
    this.hideForm = false
  }

  isCharDigit(sym : string) {
    return sym >= '0' && sym <= '9'
  }

  async submitAndClose() {
    let task = new Task(
      this.form.controls["question"].value,
      this.form.controls["answerNum"].value,
      [
          this.form.controls["variant1"].value,
          this.form.controls["variant2"].value,
          this.form.controls["variant3"].value,
          this.form.controls["variant4"].value
      ]
    )

    if (!this.newTask) {
      await this.deleteTask(this.currentTaskId)
    }
    await this.dbController.addTaskToTheme(this.currentThemeId, task, this.themeType, this.newTask)

    this.hideForm = true
    this.clearForm()
  }

  close() {
    this.hideForm = true
    this.clearForm()
  }

  submitNewTheme() {
    this.dbController.addTheme(this.themeForm.controls["themeName"].value, this.themeType).catch()
    setTimeout(() => {
      this.uploadThemes().catch()
    })
  }

  async deleteTheme(name : string) {
    let tasks = await this.dbController.getTasks(name, this.themeType).catch()
    for (let key of tasks.keys()) {
      await this.dbController.deleteTask(key, name, this.themeType).catch()
    }
    await this.dbController.deleteTheme(name, this.themeType).catch()
    await this.uploadThemes().catch()
  }

  async addTaskToTheme(name : string) {
    this.newTask = true
    this.currentThemeId = name
    this.hideForm = false
  }

  async deleteTask(taskId : string) {
    await this.dbController.deleteTask(taskId, this.currentThemeId, this.themeType).catch()
    await this.uploadTasks(this.currentThemeId)
    this.hideForm = true
  }

  clearForm() {
    this.form.controls["question"].setValue("")
    this.form.controls["answerNum"].setValue("")
    this.form.controls["variant1"].setValue("")
    this.form.controls["variant2"].setValue("")
    this.form.controls["variant3"].setValue("")
    this.form.controls["variant4"].setValue("")
  }
}
