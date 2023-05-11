import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageDetailsService } from './page-details.service';
import { PageDetails } from 'src/app/entities/page-details';
import { forkJoin } from 'rxjs';

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

  constructor(private route: ActivatedRoute, private service: PageDetailsService) {
    this.loadForm();
  }

  loadForm() {
    this.pageId = this.route.snapshot.queryParamMap.get('id');
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
