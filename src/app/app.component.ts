import { Component } from '@angular/core';
import * as M from 'materialize-css';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'LangAdministry';

  ngOnInit() : void {
    M.AutoInit()
    document.addEventListener('DOMContentLoaded', function() {
      let elems = document.querySelectorAll('select');
      let instances = M.FormSelect.init(elems);
    });
  }
}
