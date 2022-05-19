import {initializeApp, FirebaseApp} from "firebase/app";
import {getAnalytics, Analytics} from "firebase/analytics";
import {getAuth, Auth} from "firebase/auth";
import {
  getFirestore, collection, getDocs, getDoc, Firestore,
  doc, setDoc, deleteDoc
} from 'firebase/firestore';
import {TestTheme} from "../models/TestTheme"
import {Task} from "../models/Task";

export class FirebaseController {
  firebaseConfig = {
    apiKey: "AIzaSyCVDk8USt-hnvxzcPI4m4uaUXFCfp9nMZk",
    authDomain: "langlearn-d6986.firebaseapp.com",
    databaseURL: "https://langlearn-d6986-default-rtdb.firebaseio.com",
    projectId: "langlearn-d6986",
    storageBucket: "langlearn-d6986.appspot.com",
    messagingSenderId: "286610354914",
    appId: "1:286610354914:web:84985182b1ac29c9a064bb",
    measurementId: "G-YNM56EH0LV"
  };

  app: FirebaseApp
  analytics: Analytics

  database: Firestore

  constructor() {
    this.app = initializeApp(this.firebaseConfig)
    this.database = getFirestore(this.app)
  }

  async addTheme(themeName: string, type: string) {
    await setDoc(await doc(this.database, type, themeName), {});
    await this.registerChange(type, themeName, "", "theme added")
  }

  async getThemes(type: string): Promise<Map<string, TestTheme>> {
    const col = collection(this.database, type)
    const docs = await getDocs(col)
    let themes = new Map<string, TestTheme>()
    await docs.forEach((doc) => {
      themes.set(doc.id, {name: doc.id})
    })
    return Promise.resolve(themes)
  }

  async getTasks(id: string, type: string): Promise<Map<string, Task>> {
    let tasks = new Map<string, Task>()
    const theme = await doc(this.database, type, id)
    const docs = await getDocs(collection(theme, "tasks"));
    docs.forEach((doc) => {
      let task = new Task(
        doc.get("question"), doc.get("answerNum"), doc.get("choices")
      )
      tasks.set(task.question, task)
    })
    return Promise.resolve(tasks)
  }

  async deleteTheme(id: string, type: string) {
    await deleteDoc(doc(this.database, type, id))
    await this.registerChange(type, id, "", "theme deleted")
  }

  async addTaskToTheme(id: string, task: Task, type: string, newTask: boolean) {
    const theme = await doc(this.database, type, id)
    await setDoc(doc(theme, "tasks", task.question), {
      "question": task.question,
      "answerNum": task.answerNum,
      "choices": task.choices
    })
    let message = ("task " + (newTask ? "added" : "modified"))
    await this.registerChange(type, id, task.question, message)
  }

  async deleteTask(taskId: string, themeId: string, type: string) {
    const theme = await doc(this.database, type, themeId)
    await deleteDoc(doc(theme, "tasks", taskId))
    await this.registerChange(type, themeId, taskId, "task deleted")
  }

  async addAdmin(login: string, password: string) {
    await setDoc(await doc(this.database, "admins", login), {
      login: login,
      password: password
    });
  }

  async getUsersNum() {
    return (await getDocs(collection(this.database, "users"))).size
  }

  async validateAdmin(login: string, password: string) {
    try {
      const candidate = await doc(this.database, "admins", login)
      const admin = await getDoc(candidate)
      return admin.get("password") == password
    } catch (ex) {
      return false
    }
  }

  async getUsersEmails() {
    const docs = await getDocs(collection(this.database, "users"))
    let users: string[] = []
    docs.forEach((user) => {
      users.push(user.get("email"))
    })
    return users
  }

  async registerChange(type: string, theme: string, task: string, act: string) {
    let date = new Date()
    await setDoc(await doc(this.database, "changes history", date.toLocaleString()), {
      taskType: type,
      theme: theme,
      task: task,
      time: date.toLocaleString(),
      changeType: act
    })
  }

  async getChanges() : Promise<any> {
    let changes : Map<string, string>[] = []
    const docs = await getDocs(collection(this.database, "changes history"));
    docs.forEach((doc) => {
      let change = new Map<string, string>()
      change.set("time", doc.get("time"))
      change.set("theme", doc.get("theme"))
      change.set("taskType", doc.get("taskType"))
      change.set("task", doc.get("task"))
      let str = change.get("task")
      if (str) {
        if (str.length > 15) {
          str = str.slice(0, 15) + "..."
        }
      }
      change.set("task", str? str : "")
      change.set("changeType", doc.get("changeType"))
      changes.push(change)

    })
    return changes
  }

}

