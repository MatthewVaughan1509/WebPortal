import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageDetailsService } from './page-details.service';
import { PageDetails } from 'src/app/entities/page-details';
import { forkJoin } from 'rxjs';
import { DxFormComponent } from 'devextreme-angular';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss']
})

export class PageDetailsComponent implements OnInit {

  pageId: string;
  pageDetails: PageDetails;
  hasEditPermission: boolean = false;
  title: string = "Edit Page";
  action: string = "Edit";
  useSubmitBehavior: boolean = true;
  toolBarItems: any[] = [];
  isMultiLineToolbar: boolean = true;
  htmlText: any;
  isLoadPanelVisible: boolean = false;

  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent

  constructor(private route: ActivatedRoute, private service: PageDetailsService, private _toastService: ToastService ) {
    this.loadForm();
  }

  loadForm() {
    this.pageId = this.route.snapshot.queryParamMap.get('pageid');
    if (this.pageId) {
      forkJoin([
        this.service.getPageById(this.pageId)
      ]).subscribe(results => {
        if (results && results[0]) {
          this.pageDetails = results[0];
        }
      }
      );
    }
    this.hasEditPermission = true; // This needs to be set from a permissions API.
    this.toolBarItems = this.service.getToolbarItemsForHtmlEditor();
  }

  ngOnInit(): void {
  }

  submit(e: any) {
    let result: any = this.form.instance.validate();
    if (result && result.isValid) {      
      if (this.pageId) {
        this.updatePage();
      } else {
      }
    }
    e.preventDefault();
  }

  updatePage() {
    this.isLoadPanelVisible = true;
    this.service.updatePage(this.pageDetails).subscribe( results => {
      this._toastService.success("Update worked!");
      this.isLoadPanelVisible = false;
    }, error => {
      this._toastService.error("Update failed!");
      this.isLoadPanelVisible = false;      
    });
  }

  cancel() {
    window.close();
  }
}
