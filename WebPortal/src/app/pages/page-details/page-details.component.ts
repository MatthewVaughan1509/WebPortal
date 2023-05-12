import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageDetailsService } from './page-details.service';
import { PageDetails } from 'src/app/entities/page-details';
import { forkJoin } from 'rxjs';
import { DxFormComponent } from 'devextreme-angular';

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

  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent

  constructor(private route: ActivatedRoute, private service: PageDetailsService) {
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
    alert("Submit");
  }

  cancel() {
    window.close();
  }
}
