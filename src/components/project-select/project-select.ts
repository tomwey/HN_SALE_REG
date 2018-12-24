import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppStore } from '../../provider/app-store';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the ProjectSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'project-select',
  templateUrl: 'project-select.html'
})
export class ProjectSelectComponent {

  currentProject: any = {
    id: '',
    name: ''
  };

  @Input() initProject: any = { id: '', name: '' };

  @Input() size?: number;
  @Input() limitWidth?: number;
  @Input() onlyShowL1Projects: boolean = false;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  constructor(private store: AppStore,
    private modalCtrl: ModalController) {
    this.store.getProject(data => {
      if (data) {
        this.currentProject.id = data.value;
        this.currentProject.name = data.label;
      }

      this.currentProject.fromStore = true;
      this.onSelect.emit(this.currentProject);
    });
  }

  selectProject() {
    let modal = this.modalCtrl.create('SelectProjectPage',
      { onlyShowL1Projects: this.onlyShowL1Projects, currentProject: this.currentProject });
    modal.onDidDismiss((res) => {
      // console.log(res);
      if (!res) return;

      this.currentProject.name = res.label;
      this.currentProject.id = res.value;
      this.currentProject.fromStore = false;

      this.store.saveProject(res);

      this.onSelect.emit(this.currentProject);

      // this.loadData();
    });
    modal.present();
  }

}
